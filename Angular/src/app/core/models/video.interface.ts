export interface Video {
  id: number;
  title: string;
  url: string;
  subjectId: number;  // links video to its subject
}