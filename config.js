// ===== Shared settings for all pages =====
const CONFIG = {
  CONTRACT_ADDRESS: "0xBb612153C9bAe0bd0B1f8ED71910CC10dC6A1529",
  CHAIN_ID_HEX: "0xaa36a7", // Sepolia (11155111)
  RPCS: [
    "https://ethereum-sepolia-rpc.publicnode.com",
    "https://rpc.sepolia.org"
  ],
  EXPLORER: "https://sepolia.etherscan.io",
  DEPLOY_BLOCK: 0, // optional: put your contract's deployment block number for faster list loading
  ABI: [
    "function owner() view returns (address)",
    "function issueCertificate(string certId, string studentName, string course, string issueDate)",
    "function verifyCertificate(string certId) view returns (bool valid, string studentName, string course, string issueDate, uint256 issuedAt)",
    "event CertificateIssued(string certId, string studentName, string course, uint256 timestamp)"
  ]
};

// Escape text before putting it in HTML (data comes from the blockchain)
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Read-only access to the contract through public RPC (no wallet needed).
// Tries each RPC in turn.
async function withReader(fn) {
  let lastErr;
  for (const url of CONFIG.RPCS) {
    try {
      const provider = new ethers.JsonRpcProvider(url, undefined, { staticNetwork: ethers.Network.from(11155111) });
      const contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, CONFIG.ABI, provider);
      return await fn(contract, provider);
    } catch (e) { lastErr = e; }
  }
  throw lastErr;
}
