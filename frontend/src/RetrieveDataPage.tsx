import { useEffect, useState } from "react";

const RetrieveDataPage: React.FC<{ hash: string }> = ({ hash }) => {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`http://localhost:8080/retrieveData/${hash}`)
            .then(res => res.json())
            .then(response => {
                if (response.error) {
                    setError(response.error);
                } else {
                    setData(response.data);
                }
            })
            .catch(err => setError("Failed to fetch data"));
    }, [hash]);

    return (
        <div className="container">
            <h2>Retrieved Data</h2>
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : data ? (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default RetrieveDataPage;
