export interface Interaction {
    prompt: string;
    answer: string;
  }
  
  export interface Document {
    id: string;
    title: string;
    image: string;
    content: string;
    interactions: Interaction[];
  }