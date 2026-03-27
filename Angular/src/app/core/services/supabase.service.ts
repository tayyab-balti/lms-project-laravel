import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private bucket = 'Videos';

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
   }
  
   async uploadVideo(file: File): Promise<string> {
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`;   // 1712345678-abc123-lecture.mp4

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // get the public URL after successful upload
    const { data } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(fileName);

    return data.publicUrl;  // return url
  }
}