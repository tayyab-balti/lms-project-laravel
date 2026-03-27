import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from '../../core/models/subject.interface';
import { SubjectVideosService } from '../../core/services/subject-videos.service';
import { HeaderComponent } from '../header/header.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subjects',
  imports: [NgFor, NgIf, FormsModule, HeaderComponent],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.css',
})
export class SubjectsComponent {
  subjects: Subject[] = [];

  // Add form
  showForm = false;
  newSubject: Partial<Subject> = { title: '', imageFile: '', description: '' }; // some fields (like id) may be missing
  selectedFile: File | null = null;

  // Edit form
  editingSubject: Subject | null = null;

  // Delete popup
  showDeletePopup = false;
  subjectToDelete: Subject | null = null;
  
    // for edit / delete icons
    openMenuId: number | null = null;
  
  constructor(
    private router: Router,
    private subjectService: SubjectVideosService,
    private toastr: ToastrService,
  ) {}

  // automatically runs when component loads
  ngOnInit(): void {
    this.subjectService
      .getSubjects() // defines the stream
      .subscribe({
        // fires the HTTP request
        next: (data: Subject[]) => {
          // runs when response arrives
          // console.log(data)
          this.subjects = data;
          this.toastr.success('Data fetched successfully');
        },
        error: (error) => {
          console.error('Error fetching subjects:', error);
          this.toastr.error('Error fetching subjects');
        },
      });
  }

  onSelectSubject(subjectId: number): void {
    this.router.navigate([`/subjects/videos/${subjectId}`]);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0]; // safely get first file
    if (!file) return; // exit if no file selected

    this.selectedFile = file;

    // safely update imageFile only if current subject exists
    if (this.editingSubject) {
      this.editingSubject.imageFile = file.name;
    } else if (this.newSubject) {
      this.newSubject.imageFile = file.name;
    }
  }

toggleMenu(event: Event, subjectId: number) {
  event.stopPropagation(); // Prevent card click
  this.openMenuId = this.openMenuId === subjectId ? null : subjectId;
}

  // validations
  private isSubjectValid(subject: Partial<Subject>): boolean {
    // Checks title, description, and selected file
    if (!subject.title || !subject.description) {
      this.toastr.warning('Please fill all fields');
      return false;
    }

    // For Add, ensure image is selected; for Edit, allow existing image
    if (!this.selectedFile && !this.editingSubject) {
      this.toastr.warning('Please select an image');
      return false;
    }

    return true;
  }

  // ── ADD ──
  onAddSubject(): void {
    if (!this.isSubjectValid(this.newSubject)) return;

    const formData = new FormData(); // browser API used when sending file + text together
    formData.append('title', this.newSubject.title!);
    formData.append('description', this.newSubject.description ?? '');
    if (this.selectedFile) {
      formData.append('image', this.selectedFile); // 'image' matches upload.single('image')
    }

    this.subjectService.createSubject(formData).subscribe({
      next: (created: Subject) => {
        this.subjects.push(created);
        this.toastr.success('Subject added successfully');
        this.newSubject = { title: '', imageFile: '', description: '' }; // reset form
        this.selectedFile = null;
        this.showForm = false;
      },
      error: (err) => console.error('Error creating subject:', err),
    });
  }

  onEditSubject(event: Event, subject: Subject): void {
    event.stopPropagation();
    this.openMenuId = null;
    this.editingSubject = { ...subject }; // copy so original isn't mutated
    this.showForm = false;
  }

  onUpdateSubject(): void {
    if (!this.editingSubject || !this.isSubjectValid(this.editingSubject))
      return;

    const formData = new FormData();
    formData.append('title', this.editingSubject.title);
    formData.append('description', this.editingSubject.description ?? '');
    if (this.selectedFile) {
      formData.append('image', this.selectedFile); // only if new image picked
    }

    this.subjectService
      .updateSubject(this.editingSubject.id, formData)
      .subscribe({
        next: (updated: Subject) => {
          const index = this.subjects.findIndex((s) => s.id === updated.id);
          this.subjects[index] = updated; // replace old with updated in array
          this.editingSubject = null; // close edit form
          this.selectedFile = null;
          this.toastr.success('Subject updated successfully');
        },
        error: (err) => {
          (console.error('Error updating subject:', err),
            this.toastr.error('Error updating subject'));
        },
      });
  }

  get currentSubject(): Partial<Subject> {
    return this.editingSubject || this.newSubject;
  }

  onCancel(): void {
    this.showForm = false;
    this.editingSubject = null;
  }

  // ── DELETE ──
  onDeleteClick(event: Event, subject: Subject): void {
    event.stopPropagation(); // prevents triggering onSelectSubject
    this.openMenuId = null;
    this.subjectToDelete = subject;
    this.showDeletePopup = true;
  }

  onConfirmDelete(): void {
    if (!this.subjectToDelete) return;

    this.subjectService.deleteSubject(this.subjectToDelete.id).subscribe({
      next: () => {
        this.subjects = this.subjects.filter(
          (s) => s.id !== this.subjectToDelete!.id,
        );
        this.showDeletePopup = false;
        this.subjectToDelete = null;
        this.toastr.success('Subject deleted successfully');
      },
      error: (err) => {
        console.error('Error deleting subject:', err);
        this.toastr.error('Error deleting subject');
      },
    });
  }

  onCancelDelete(): void {
    this.showDeletePopup = false;
    this.subjectToDelete = null;
  }
}
