import { school } from "../data/school";

export default function Contact() {
  return (
    <div className="card">
      <h1>Контакт</h1>
      <div className="contactGrid">
        <div>
          <div className="label">Адреса</div>
          <div>{school.address}</div>
        </div>
        <div>
          <div className="label">Телефон</div>
          <div>{school.phone}</div>
        </div>
        <div>
          <div className="label">Веб</div>
          <div>{school.website}</div>
        </div>
      </div>
    </div>
  );
}