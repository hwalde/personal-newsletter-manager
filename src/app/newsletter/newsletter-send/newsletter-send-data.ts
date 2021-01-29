export interface RecipientData {
  recipientId: number,
  data: object[],
  progress: number,
  status: "prepare" | "sending" | "finished"
  sendError?: string,
  sendLog?: string,
}

export interface NewsletterSendData {
  newsletterId: number,
  recipientDataList: RecipientData[]
}
