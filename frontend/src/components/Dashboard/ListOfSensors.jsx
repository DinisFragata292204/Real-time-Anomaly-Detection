export default function ListOfSensors({ sensors, onSensorClick }) {
    return (
        <table className="bg-slate-600 p-4 rounded-lg shadow">
            <thead className="text-black">
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Location</th>
                </tr>
            </thead>
            <tbody className="table-body">
                {sensors.map((item) => (
                <tr className="hover:bg-gray-100 cursor-pointer text-black" key={item.id} onClick={() => onSensorClick(item.id)}>
                    <td>{item.name}</td>
                    <td>{item.type}</td>
                    <td>{item.localization}</td>
                </tr>
                ))}
            </tbody>
        </table>
    );
}