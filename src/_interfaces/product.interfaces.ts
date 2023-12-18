export interface ProductI {
  id?: string;
  title: string;
  origin: string;
  process: string;
  variety: string;
  altitude: string;
  acidity: number;
  body: number;
  notes: string;
  image?: string;
  stories: string;
  createdAt: Date;
}
