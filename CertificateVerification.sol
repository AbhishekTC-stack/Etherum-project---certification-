// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Certificate Verification System
/// @notice The institution (owner) issues certificates; anyone can verify them by ID.
contract CertificateVerification {
    address public owner;

    struct Certificate {
        string studentName;
        string course;
        string issueDate;   // e.g. "2026-11-09"
        uint256 issuedAt;   // block timestamp
        bool exists;
    }

    mapping(string => Certificate) private certificates;

    event CertificateIssued(string certId, string studentName, string course, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the institution can issue certificates");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Issue a new certificate (admin only)
    function issueCertificate(
        string memory certId,
        string memory studentName,
        string memory course,
        string memory issueDate
    ) public onlyOwner {
        require(bytes(certId).length > 0, "Certificate ID required");
        require(!certificates[certId].exists, "Certificate ID already exists");

        certificates[certId] = Certificate(
            studentName,
            course,
            issueDate,
            block.timestamp,
            true
        );

        emit CertificateIssued(certId, studentName, course, block.timestamp);
    }

    /// @notice Verify a certificate by its ID (anyone, free to call)
    function verifyCertificate(string memory certId)
        public
        view
        returns (
            bool valid,
            string memory studentName,
            string memory course,
            string memory issueDate,
            uint256 issuedAt
        )
    {
        Certificate memory c = certificates[certId];
        return (c.exists, c.studentName, c.course, c.issueDate, c.issuedAt);
    }
}
