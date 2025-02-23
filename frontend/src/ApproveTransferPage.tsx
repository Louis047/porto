import { useState, useEffect } from "react";

const ApproveTransferPage: React.FC<{ hash: string }> = ({ hash }) => {
    const [approved, setApproved] = useState<boolean>(false);

    useEffect(() => {
        const approveTransfer = async () => {
            const response = await fetch("http://localhost:8080/approveTransfer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ hash })
            });
            const result = await response.json();
            if (result.message) {
                setApproved(true);
            }
        };

        approveTransfer();
    }, [hash]);

    return (
        <div className="container">
            <h2>Transfer {approved ? "Approved ✅" : "Waiting for Approval..."}</h2>
        </div>
    );
};

export default ApproveTransferPage;