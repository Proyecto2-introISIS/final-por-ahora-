import { useState } from 'react';

export default function BudgetForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [participants, setParticipants] = useState([{ name: '', email: '' }]);

  const handleAddParticipant = () => {
    setParticipants([...participants, { name: '', email: '' }]);
  };

  const handleChangeParticipant = (index, field, value) => {
    const newParticipants = [...participants];
    newParticipants[index][field] = value;
    setParticipants(newParticipants);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, participants });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Budget Name" />
      {participants.map((participant, index) => (
        <div key={index}>
          <input type="text" value={participant.name} onChange={(e) => handleChangeParticipant(index, 'name', e.target.value)} placeholder="Name" />
          <input type="email" value={participant.email} onChange={(e) => handleChangeParticipant(index, 'email', e.target.value)} placeholder="Email" />
        </div>
      ))}
      <button type="button" onClick={handleAddParticipant}>Add Participant</button>
      <button type="submit">Create Budget</button>
    </form>
  );
}