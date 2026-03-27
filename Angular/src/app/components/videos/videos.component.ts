import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Video } from '../../core/models/video.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectVideosService } from '../../core/services/subject-videos.service';
import { HeaderComponent } from '../header/header.component';
import { SupabaseService } from '../../core/services/supabase.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-videos',
  imports: [NgFor, NgIf, FormsModule, HeaderComponent],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.css',
})
export class VideosComponent implements OnInit {
  videos: Video[] = [];
  subjectId: number | undefined;

  // Add form
  showForm = false;
  newVideo = { title: '' };
  selectedVideoFile: File | null = null;

  // Edit form
  editingVideo: Video | null = null;
  editVideoFile: File | null = null;

  // Delete popup
  showDeletePopup = false;
  videoToDelete: Video | null = null;

  // Upload state
  isUploading = false;

  constructor(
    private route: ActivatedRoute,
    private videoService: SubjectVideosService,
    private supabaseService: SupabaseService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id'); // snapshot captures url last name

    if (idParam) {
      this.subjectId = Number(idParam); // Convert the string ID to a number

      // Fetch the videos for this subject
      this.videoService.getVideosBySubjectId(this.subjectId).subscribe({
        next: (videos: Video[]) => {
          this.videos = videos; // Assign the response to the videos array
        },
        error: (err) => {
          console.error('Error fetching videos:', err);
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/subjects']);
  }

  onVideoFileChange(event: Event, isEdit = false): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      isEdit
        ? (this.editVideoFile = input.files[0])
        : (this.selectedVideoFile = input.files[0]);
    }
  }

  // ── ADD ──
  async onAddVideo(): Promise<void> {
    if (!this.newVideo.title || !this.selectedVideoFile) {
      this.toastr.warning('Please fill all fields');
      return
    };

    const maxSizeMB = 50;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (this.selectedVideoFile.size > maxSizeBytes) {
      this.toastr.warning(
        `Video is too large. Maximum allowed size is ${maxSizeMB}MB.`,
      );
      return;
    }

    try {
      this.isUploading = true;

      // upload to Supabase, get back public URL
      const videoUrl = await this.supabaseService.uploadVideo(
        this.selectedVideoFile,
      );

      // send title + URL + subjectId to Node backend
      const payload = {
        title: this.newVideo.title,
        url: videoUrl,
        subjectId: this.subjectId,
      };

      this.videoService.createVideo(payload).subscribe({
        next: (created: Video) => {
          this.videos.push(created);
          this.newVideo = { title: '' };
          this.selectedVideoFile = null;
          this.showForm = false;
          this.isUploading = false;
          this.toastr.success("Video added successfully")
        },
        error: (err) => {
          console.error('Error saving video:', err);
          this.toastr.error('Failed to save video');
          this.isUploading = false;
        },
      });
    } catch (err) {
      console.error('Error uploading to Supabase:', err);
      this.toastr.error('Upload failed. Please try a smaller video file.');
      this.isUploading = false;
    }
  }

  // ── EDIT ──
  onEditVideo(event: Event, video: Video): void {
    event.stopPropagation();
    this.editingVideo = { ...video };
    this.editVideoFile = null;
    this.showForm = false;
  }

  async onUpdateVideo(): Promise<void> {
    if (!this.editingVideo || !this.editingVideo.title) {
      this.toastr.warning('Please fill all fields')
      return
    }

    const maxSizeMB = 50;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (this.editVideoFile && this.editVideoFile.size > maxSizeBytes) {
      this.toastr.warning(`Video is too large. Maximum allowed size is ${maxSizeMB}MB.`);
      return;
    }

    try {
      this.isUploading = true;
      let videoUrl = this.editingVideo.url;

      // only upload new file if user picked one
      if (this.editVideoFile) {
        videoUrl = await this.supabaseService.uploadVideo(this.editVideoFile);
      }

      const payload = { title: this.editingVideo.title, url: videoUrl };

      this.videoService.updateVideo(this.editingVideo.id, payload).subscribe({
        next: (updated: Video) => {
          const index = this.videos.findIndex((v) => v.id === updated.id);
          this.videos[index] = updated;
          this.editingVideo = null;
          this.editVideoFile = null;
          this.isUploading = false;
        },
        error: (err) => {
          console.error('Error updating video:', err);
          this.isUploading = false;
          this.toastr.error('Error updating video')
        },
      });
    } catch (err) {
      console.error('Error uploading to Supabase:', err);
      this.toastr.error('Upload failed. Please try a smaller video file.');
      this.isUploading = false;
    }
  }

  onCancelEdit(): void {
    this.editingVideo = null;
    this.editVideoFile = null;
  }

  // ── DELETE ──
  onDeleteClick(event: Event, video: Video): void {
    event.stopPropagation();
    this.videoToDelete = video;
    this.showDeletePopup = true;
  }

  onConfirmDelete(): void {
    if (!this.videoToDelete) return;

    this.videoService.deleteVideo(this.videoToDelete.id).subscribe({
      next: () => {
        this.videos = this.videos.filter(
          (v) => v.id !== this.videoToDelete!.id,
        );
        this.showDeletePopup = false;
        this.videoToDelete = null;
        this.toastr.success('Video deleted successfully');

      },
      error: (err) => {
        this.toastr.error('Failed to delete video')
        console.error('Error deleting video:', err)
      }
    });
  }

  onCancelDelete(): void {
    this.showDeletePopup = false;
    this.videoToDelete = null;
  }
}
