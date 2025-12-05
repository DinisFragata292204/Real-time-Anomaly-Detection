export default function DataOfASensorTable({ data }) {
    const hasData = data.length > 0;
    return (
        <table className="w-full bg-white rounded-lg shadow overflow-hidden text-left">
            <thead className="dark:bg-blue-950 bg-blue-600 text-white">
                <tr>
                    <th className="px-4 py-2 font-medium text-center">Id</th>
                    <th className="px-4 py-2 font-medium text-center">Value</th>
                    <th className="px-4 py-2 font-medium text-center">Timestamp</th>
                </tr>
            </thead>
            
            <tbody className="dark:bg-gray-900 bg-gray-100">

            {hasData ? (
                    data.map((sensors, idx) => (
                    <tr 
                        key={idx} 
                        className={"cursor-pointer transition-colors hover:bg-blue-50 dark:hover:bg-gray-600"}
                    >
                        <td className="px-4 py-2 border-b text-center">{idx + 1}</td>
                        <td className="px-4 py-2 border-b text-center">{sensors.value}</td>
                        <td className="px-4 py-2 border-b text-center">{new Date(sensors.timestamp).toLocaleString("pt-PT")}</td>
                    </tr>
                    ))
            ) : (
                <tr>
                    <td
                        colSpan="3"
                        className="px-4 py-3 border-b text-center text-gray-500 italic"
                    >
                        You don't have data to show yet.
                    </td>
                </tr>
            )}
            </tbody>
       </table>
        
    );
}
