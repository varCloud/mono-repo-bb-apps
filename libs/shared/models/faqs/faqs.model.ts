export interface Faq {
  categoryId?: number;
  question: string;
  answer: string;
}

export class FaqModel implements Faq {
  categoryId: number;
  question: string;
  answer: string;
  constructor(data: any) {
    this.categoryId = data.categoryId;
    this.question = data.question;
    this.answer = data.answer;
  }


}
export interface RequestFaqs
{
categoryId: number;
userTypeId: number;
}
