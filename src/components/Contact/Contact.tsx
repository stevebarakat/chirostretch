import { RawHtml } from "../RawHtml";
import { ContactForm } from "../ContactForm";
import { Map } from "../Map";

type Props = {
  content: string;
};

function Contact({ content }: Props) {
  return (
    <div className="contactWrap">
      <div>
        <RawHtml>{content}</RawHtml>
        <ContactForm />
      </div>
      <Map />
    </div>
  );
}

export default Contact;
