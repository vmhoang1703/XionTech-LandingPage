// The "Let's talk" band that closes Products and News (Amber, 2026-10-16): it
// replaces the email capture band and leads to Home's contact form. Headings
// reuse the approved capture and Home contact headings. English and Vietnamese
// only; the other locales show the English until translated.
export const talkBand = {
  products: {
    heading: "See it working at your school",
    body: "Tell us about your school and we'll show you how Parent Hub, Staff Hub and AI Tutor work together.",
  },
  news: {
    heading: "Have something you want to build?",
    body: "Tell us about your idea and we'll get back to you.",
  },
};

export const talkBandVi: typeof talkBand = {
  products: {
    heading: "Xem ứng dụng hoạt động tại trường của bạn",
    body: "Hãy kể cho chúng tôi về trường của bạn, chúng tôi sẽ cho bạn thấy Parent Hub, Staff Hub và AI Tutor phối hợp với nhau như thế nào.",
  },
  news: {
    heading: "Bạn có điều gì muốn xây dựng?",
    body: "Hãy chia sẻ ý tưởng của bạn, chúng tôi sẽ phản hồi bạn.",
  },
};
