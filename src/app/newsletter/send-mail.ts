export interface SendMail {
  newsletterId:number,
  recipientId:number,
  emailAddress:string,
  subject:string,
  message:string,
  sendDate:Date
}
