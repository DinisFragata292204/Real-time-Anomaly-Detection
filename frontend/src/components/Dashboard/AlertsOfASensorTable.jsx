export default function AlertsOfASensorTable({ alerts }) {
    const hasAlerts = alerts.length > 0;

    return (
        <table className="w-full bg-white rounded-lg shadow overflow-hidden text-left">
            <thead className="dark:bg-blue-950 bg-blue-600 text-white">
                <tr>
                    <th className="px-4 py-2 font-medium text-center">Id</th>
                    <th className="px-4 py-2 font-medium text-center">Value</th>
                    <th className="px-4 py-2 font-medium text-center">Type</th>
                    <th className="px-4 py-2 font-medium text-center">Message</th>
                    <th className="px-4 py-2 font-medium text-center">Timestamp</th>
                </tr>
            </thead>
            <tbody className="table-body">
                {hasAlerts ? (
                    alerts.map((sensors, idx) => (
                        <tr 
                            key={idx}
                            className={"cursor-pointer transition-colors dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-gray-600"}
                        >
                            <td className="px-4 py-2 border-b text-center">{idx + 1}</td>
                            <td className="px-4 py-2 border-b text-center">{sensors.value}</td>
                            <td className="px-4 py-2 border-b text-center">{sensors.type}</td>
                            <td className="px-4 py-2 border-b text-center">{sensors.message}</td>
                            <td className="px-4 py-2 border-b text-center">{new Date(sensors.timestamp).toLocaleString("pt-PT")}</td>
                        </tr>
                    ))
                ):(
                    <tr>
                        <td
                            colSpan="5"
                            className="px-4 py-3 border-b text-center text-gray-500 italic dark:bg-gray-900"
                        >
                            You don't have alerts to show yet.
                        </td>
                    </tr>
                )}
                
            </tbody>
        </table>
    );
}