import { User } from "../interfaces";

function Table({ list }) {
  return (
    <table className="table">
      <thead>
        <tr>
          {Object.keys(list[0])
            .slice(1)
            .map((key) => (
              <th key={`th${key}`}>{key.toUpperCase()}</th>
            ))}
        </tr>
      </thead>
      <tbody>
        {list.map((participant: User) => (
          <tr key={`par${participant.id}`}>
            {Object.keys(participant)
              .slice(1)
              .map((key) => (
                <td key={`value-of-${key}`}>
                  {key.includes("date")
                    ? participant[key].split("T")[0]
                    : participant[key]}
                </td>
              ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
