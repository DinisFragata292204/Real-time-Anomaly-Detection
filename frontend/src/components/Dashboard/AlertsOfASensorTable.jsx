export default function AlertsOfASensorTable({ alerts }) {
    return (
        <table className="table_selected_sensor">
            <thead className="table-th_selected_sensor">
                <tr>
                <th>Sensor_id</th>
                <th>Value</th>
                <th>Type</th>
                <th>Message</th>
                <th>Timestamp</th>
                </tr>
            </thead>
            <tbody className="table-body">
                {alerts.map((sensors, idx) => (
                <tr key={idx}>
                    <td>{sensors.sensor_id}</td>
                    <td>{sensors.value}</td>
                    <td>{sensors.type}</td>
                    <td>{sensors.message}</td>
                    <td>{sensors.timestamp}</td>
                </tr>
                ))}
            </tbody>
        </table>
    );
}