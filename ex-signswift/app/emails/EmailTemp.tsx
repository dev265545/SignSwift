// import {
//   Body,
//   Button,
//   Container,
//   Head,
//   Hr,
//   Html,
//   Img,
//   Link,
//   Preview,
//   Section,
//   Text,
// } from "@react-email/components";
// import * as React from "react";
// import logo from "ex_logo.png";
// const baseUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : "";
// export const Ex2Email = (props: { subject: string; email_body: string }) => (
//   <Html>
//     <Head />
//     <Preview>You're now ready to make live transactions with Stripe!</Preview>
//     <Body style={main}>
//       <Container style={container}>
//         <Section style={box}>
//           <Img
//             src={`${baseUrl}/ex_logo.png`}
//             width="100"
//             height="100"
//             alt="ExSquared"
//           />
//           <Hr style={hr} />
//           <Text style={paragraph}>
//             Thank you check for applying at ExSquared. We are glad to offer you
//             an internship at our organization.
//           </Text>

//           <Text>{props.subject}</Text>
//           <Text>{props.email_body}</Text>
//           <Section style={btnSection}>
//             <Text>Ex Squared Has send you a document to review and Sign</Text>
//             <Button style={button} href="https://dashboard.stripe.com/login">
//               Open the Document
//             </Button>
//           </Section>
//           <Hr style={hr} />
//           <Text style={paragraph}>
//             If you haven't finished your integration, you might find our{" "}
//             <Link style={anchor} href="https://stripe.com/docs">
//               docs
//             </Link>{" "}
//             handy.
//           </Text>
//           <Text style={paragraph}>
//             Our teams are young and passionate about work; people do not come
//             here to play safe. We have people who want their work to add up to
//             something, making a difference. We are all about quality and
//             delivering a great user experience to our end users. We feel proud
//             of doing the kind of work that one will never compromise on and
//             would want to sacrifice the weekend for that kind of work because we
//             know that our product matters and make a difference in our
//             consumer's life.
//           </Text>
//           <Text style={paragraph}>
//             I am sharing the offer letter and an email with you; if you accept
//             this offer, please sign it. Your joining date and other details are
//             mentioned in the attached offer letter. Please let me know if you
//             have any queries or concerns.
//           </Text>
//           <Text style={paragraph}>— ExSq Hr Team</Text>
//           <Hr style={hr} />
//           <Text style={footer}>
//             This email contains a secure link to DocuSign. Please do not share
//             this email, link, or access code with others.
//           </Text>
//         </Section>
//       </Container>
//     </Body>
//   </Html>
// );
// export default Ex2Email;
// const main = {
//   backgroundColor: "#F6F9FC",
//   fontFamily:
//     '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
// };
// const container = {
//   backgroundColor: "#FFFFFF",
//   margin: "0 auto",
//   padding: "20px 0 48px",
//   marginBottom: "64px",
// };
// const box = {
//   padding: "0 48px",
// };
// const btnSection = {
//   backgroundColor: "#F33A6A",
//   display: "flex",
//   justifyContent: "center",
//   padding: "10px",
//   borderRadius: "5px",
//   color: "#FFFFFF",
// };
// const hr = {
//   borderColor: "#E6EBF1",
//   margin: "20px 0",
// };
// const paragraph = {
//   color: "#525F7F",
//   fontSize: "16px",
//   lineHeight: "24px",
//   textAlign: "left" as const,
// };
// const anchor = {
//   color: "#556CD6",
// };
// const button = {
//   // backgroundColor: "#656EE8",
//   backgroundColor: "#000080",
//   borderRadius: "5px",
//   color: "#fff",
//   fontSize: "16px",
//   fontWeight: "bold",
//   textDecoration: "none",
//   textAlign: "center" as const,
//   display: "block",
//   // width: "100%",
//   padding: "10px 0px",
// };
// const footer = {
//   color: "#8898AA",
//   fontSize: "12px",
//   lineHeight: "16px",
// };
