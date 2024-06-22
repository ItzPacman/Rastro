// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ERC4626Vault
 * @dev ERC-4626 compliant vault contract for handling stablecoins and bearing tokens.
 */
contract Rastro is Ownable {

    using SafeERC20 for IERC20;

    IERC20 private _stablecoin; // The stablecoin (ERC-20 token) stored in the vault

    mapping(address => uint256) private _balance; // Mapping of bearing token balances
    mapping(address => bool) private _approvedMerchants; // Mapping of approved merchants
    mapping(address => uint256) private _maxDailyWithdrawal; // Maximum daily withdrawal for merchants
    mapping(address => bool) private _distributors; // Mapping of distributors who have received funds

    struct WithdrawalInfo {
        uint256 lastWithdrawalTime;
        uint256 withdrawnToday;
    }

    mapping(address => WithdrawalInfo) private _withdrawalInfo; // Mapping of merchants' withdrawal information

    event Deposit(address indexed depositor, uint256 amount);
    event Mint(address indexed recipient, uint256 amount);
    event Distribution(address indexed recipient, uint256 amount);
    event BatchDistribution(address[] recipients, uint256[] amounts);
    event Transfer(
        address indexed sender,
        address indexed recipient,
        uint256 amount
    );
    event Redeem(address indexed redeemer, uint256 amount);
    event MerchantApproved(address indexed merchant, bool approved);
    event DailyWithdrawalLimitChanged(
        address indexed merchant,
        uint256 newLimit
    );

    /**
     * @dev Constructor to initialize the ERC4626Vault.
     * @param stablecoinAddress The address of the stablecoin (ERC-20 token) to store in the vault.
     */
    constructor(address stablecoinAddress) Ownable(msg.sender) {
        require(stablecoinAddress != address(0), "Invalid stablecoin address");
        _stablecoin = IERC20(stablecoinAddress);
    }

    /**
     * @dev Function to mint bearing tokens against deposited stablecoins.
     * @param recipient The recipient of the minted bearing tokens.
     * @param amount The amount of bearing tokens to mint.
     */
    function _mint(address recipient, uint256 amount) internal onlyOwner {
        require(recipient != address(0), "Invalid recipient address");
        require(amount > 0, "Mint amount must be greater than zero");

        _balance[recipient] += amount;
        _distributors[recipient] = true;
        emit Mint(recipient, amount);
    }

    /**
     * @dev Function to deposit ERC-20 stablecoins into the vault.
     * @param amount The amount of stablecoins to deposit.
     */
    function deposit(uint256 amount) external  {
        require(amount > 0, "Deposit amount must be greater than zero");
        _stablecoin.safeTransferFrom(msg.sender, address(this), amount);
        _mint(msg.sender, amount);
        emit Deposit(msg.sender, amount);
    }


    /**
     * @dev Function to distribute bearing tokens to multiple recipients in a batch.
     * @param recipients The array of recipients of the bearing tokens.
     * @param amounts The array of amounts of bearing tokens to distribute to each recipient.
     */
    function batchDistribute(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external onlyOwner {
        require(recipients.length == amounts.length, "Arrays length mismatch");

        for (uint256 i = 0; i < recipients.length; i++) {
            address recipient = recipients[i];
            uint256 amount = amounts[i];
            require(recipient != address(0), "Invalid recipient address");
            require(
                amount > 0 && amount <= _balance[msg.sender],
                "Invalid distribution amount"
            );

            _balance[msg.sender] -= amount;
            _balance[recipient] += amount;
            _distributors[recipient] = true;
            emit Distribution(recipient, amount);
        }
        emit BatchDistribution(recipients, amounts);
    }

    /**
     * @dev Function to transfer bearing tokens to another address.
     * @param recipient The recipient of the bearing tokens.
     * @param amount The amount of bearing tokens to transfer.
     */
    function transfer(address recipient, uint256 amount) external {
        require(_distributors[msg.sender], "Not an authorized distributor");
        require(
            _approvedMerchants[recipient],
            "Recipient is not an approved merchant"
        );
        require(recipient != address(0), "Invalid recipient address");
        require(
            amount > 0 && amount <= _balance[msg.sender],
            "Invalid transfer amount"
        );

        _balance[msg.sender] -= amount;
        _balance[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
    }

    /**
     * @dev Function to redeem bearing tokens for stablecoins (only approved merchants).
     * @param amount The amount of bearing tokens to redeem.
     */
    function redeemTokens(uint256 amount) external {
        require(_approvedMerchants[msg.sender], "Merchant not approved");
        require(
            amount > 0 && amount <= _balance[msg.sender],
            "Invalid redeem amount"
        );

        WithdrawalInfo storage info = _withdrawalInfo[msg.sender];
        if (block.timestamp > info.lastWithdrawalTime + 1 days) {
            info.withdrawnToday = 0;
            info.lastWithdrawalTime = block.timestamp;
        }

        require(
            amount + info.withdrawnToday <= _maxDailyWithdrawal[msg.sender],
            "Exceeded daily withdrawal limit"
        );

        info.withdrawnToday += amount;
        _balance[msg.sender] -= amount;
        _stablecoin.safeTransfer(msg.sender, amount);
        emit Redeem(msg.sender, amount);
    }

    /**
     * @dev Function to set the maximum daily withdrawal limit for an approved merchant.
     * @param merchant The address of the approved merchant.
     * @param newLimit The new daily withdrawal limit.
     */
    function _setDailyWithdrawalLimit(address merchant, uint256 newLimit)
        public
        onlyOwner
    {
        _maxDailyWithdrawal[merchant] = newLimit;
        emit DailyWithdrawalLimitChanged(merchant, newLimit);
    }


    /**
     * @dev Function to batch approve multiple merchants for receiving bearing tokens.
     * @param merchants The array of addresses representing the merchants to approve.
     * @param approved The array of approval statuses corresponding to each merchant (true/false).
     */
    function batchApproveMerchants(
        address[] calldata merchants,
        bool[] calldata approved,
        uint256[] calldata limits
    ) external onlyOwner {
        require(merchants.length == approved.length, "Arrays length mismatch");

        for (uint256 i = 0; i < merchants.length; i++) {
            address merchant = merchants[i];
            uint256 limit = limits[i];
            bool approvalStatus = approved[i];
            require(merchant != address(0), "Invalid merchant address");
            _setDailyWithdrawalLimit(merchant, limit);

            _approvedMerchants[merchant] = approvalStatus;
            emit MerchantApproved(merchant, approvalStatus);
        }
    }

    /**
     * @dev Function to retrieve the balance of bearing tokens for a given address.
     * @param account The address to check the bearing token balance of.
     * @return The balance of bearing tokens for the specified address.
     */
    function balanceOf(address account) external view returns (uint256) {
        return _balance[account];
    }

    /**
     * @dev Function to retrieve the balance of stablecoins held by the vault.
     * @return The balance of stablecoins held by the vault.
     */
    function vaultBalance() external view returns (uint256) {
        return _stablecoin.balanceOf(address(this));
    }

    /**
     * @dev Function to check if an address is an approved merchant for bearing token redemption.
     * @param merchant The address to check.
     * @return A boolean indicating whether the address is an approved merchant.
     */
    function isApprovedMerchant(address merchant) external view returns (bool) {
        return _approvedMerchants[merchant];
    }

    /**
     * @dev Function to retrieve the maximum daily withdrawal limit for an approved merchant.
     * @param merchant The approved merchant to check.
     * @return The maximum daily withdrawal limit for the merchant.
     */
    function getDailyWithdrawalLimit(address merchant)
        external
        view
        returns (uint256)
    {
        return _maxDailyWithdrawal[merchant];
    }
}
