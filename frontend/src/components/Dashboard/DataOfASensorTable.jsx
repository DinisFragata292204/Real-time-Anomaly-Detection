export default function DataOfASensorTable({ data }) {
    return (
        <table className="table_selected_sensor">
            <thead className="table-th_selected_sensor">
                <tr>
                <th>Sensor_id</th>
                <th>Value</th>
                <th>Timestamp</th>
                </tr>
            </thead>
            <tbody className="table-body">
                {data.map((sensors, idx) => (
                <tr key={idx}>
                    <td>{sensors.sensor_id}</td>
                    <td>{sensors.value}</td>
                    <td>{sensors.timestamp}</td>
                </tr>
                ))}
            </tbody>
        </table>
    );
}
