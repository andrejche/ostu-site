import { school } from "../data/school";

export default function Programs() {
  return (
    <div className="card">
      <h1>Насоки</h1>
      <div className="programGrid">
        {school.programs.map((p) => (
          <div className="programCard" key={p}>
            <div className="programTitle">{p}</div>
            <div className="muted small">Опис може да додадеш подоцна.</div>
          </div>
        ))}
      </div>
    </div>
  );
}