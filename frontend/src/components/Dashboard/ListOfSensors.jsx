export default function ListOfSensors({ sensors, onSensorClick, selectedSensorId }) {
    const hasSensors = sensors.length > 0;

    return (
        <div className="w-full max-h-80 overflow-y-auto rounded-lg shadow">
            <table className="w-full bg-white rounded-lg shadow overflow-hidden text-left">
                <thead className="dark:bg-blue-950 bg-blue-600 text-white">
                    <tr>
                        <th className="px-4 py-2 font-medium">Name</th>
                        <th className="px-4 py-2 font-medium">Type</th>
                        <th className="px-4 py-2 font-medium">Location</th>
                    </tr>
                </thead>

                <tbody className="dark:bg-gray-900 bg-gray-100">

                    {hasSensors ? (
                        sensors.map((item) => {
                            const isSelected = item.id === selectedSensorId;

                            return (
                                <tr
                                    key={item.id}
                                    onClick={() => onSensorClick(item.id)}
                                    className={`cursor-pointer transition-colors
                                        ${isSelected ? "dark:bg-gray-700 bg-blue-100" : "hover:bg-blue-50 dark:hover:bg-gray-600"}
                                    `}
                                >
                                    <td className="px-4 py-2 border-b">{item.name}</td>
                                    <td className="px-4 py-2 border-b">{item.type}</td>
                                    <td className="px-4 py-2 border-b">{item.localization}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td
                                colSpan="3"
                                className="px-4 py-3 border-b text-center text-gray-500 italic"
                            >
                                You don't have sensors yet.
                            </td>
                        </tr>
                    )}

                </tbody>
            </table>
        </div>
    );
}