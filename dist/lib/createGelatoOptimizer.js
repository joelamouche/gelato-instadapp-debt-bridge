"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGelatoOptimizer = void 0;
var ethers_1 = require("ethers");
var abiEncodeWithSelector_1 = require("./utils/abiEncodeWithSelector");
var constants_1 = require("../constants/constants");
var GelatoCoreLib = require("@gelatonetwork/core");
var DSA = require("dsa-sdk");
// Constants
var ETH_Address = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
var APY_2_PERCENT_IN_SECONDS = ethers_1.BigNumber.from("1000000000627937192491029810");
// Contracts
var InstaAccount = require("../../pre-compiles/InstaAccount.json");
var ConnectMaker = require("../../pre-compiles/ConnectMaker.json");
var ConnectCompound = require("../../pre-compiles/ConnectCompound.json");
var ConnectAuth = require("../../pre-compiles/ConnectAuth.json");
var ConditionCompareUintsFromTwoSources = require("../artifacts/ConditionCompareUintsFromTwoSources.json");
var MockCDAI = require("../../artifacts/MockCDAI.json");
var MockDSR = require("../../artifacts/MockDSR.json");
var ConnectGelato_ABI = require("../../pre-compiles/ConnectGelato_ABI");
// requires the user to have an open Maker Vault
// NB: it requires mock contract addresses for now but will use actual maker and compound deployed contract in next iteration
function createGelatoOptimizer(web3, dsaAddress, eth_amount, mockCDAIAddress, mockDSRAddress, conditionAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var gelatoCore, dsa, conditionCompareUints, provider, userWallet, userAddress, dsaSdk, addAuthData, MIN_SPREAD, rebalanceCondition, _a, _b, spells, connectorPaybackMakerVault, connectorWithdrawFromMakerVault, connectorDepositIntoCompound, connectorBorrowFromCompound, GAS_LIMIT, GAS_PRICE_CEIL, taskRefinanceMakerToCompoundIfBetter, gelatoSelfProvider, _c, _d, TASK_AUTOMATION_FUNDS, expiryDate, taskReceiptId;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    provider = new ethers_1.ethers.providers.Web3Provider(web3.currentProvider);
                    return [4 /*yield*/, provider.getSigner()];
                case 1:
                    userWallet = _g.sent();
                    return [4 /*yield*/, userWallet.getAddress()];
                case 2:
                    userAddress = _g.sent();
                    dsaSdk = new DSA(web3);
                    // Instantiate Contracts
                    gelatoCore = new ethers_1.Contract(constants_1.constants.GelatoCore, GelatoCoreLib.GelatoCore.abi, userWallet);
                    dsa = new ethers_1.Contract(dsaAddress, InstaAccount.abi, userWallet);
                    conditionCompareUints = new ethers_1.Contract(conditionAddress, ConditionCompareUintsFromTwoSources.abi, userWallet);
                    return [4 /*yield*/, dsaSdk.getAuthByAddress(dsaAddress)];
                case 3:
                    if (!!(_g.sent()).includes(gelatoCore.address)) return [3 /*break*/, 5];
                    addAuthData = abiEncodeWithSelector_1.abiEncodeWithSelector(ConnectAuth.abi, "add", [
                        gelatoCore.address,
                    ]);
                    return [4 /*yield*/, dsa.cast([constants_1.constants.ConnectAuth], [addAuthData], userAddress)];
                case 4:
                    _g.sent();
                    _g.label = 5;
                case 5:
                    MIN_SPREAD = "10000000";
                    _b = (_a = GelatoCoreLib.Condition).bind;
                    _e = {
                        inst: conditionCompareUints.address
                    };
                    return [4 /*yield*/, conditionCompareUints.getConditionData(mockCDAIAddress, // We are in DSR so we compare against CDAI => SourceA=CDAI
                        mockDSRAddress, // SourceB=DSR
                        abiEncodeWithSelector_1.abiEncodeWithSelector(MockCDAI.abi, "supplyRatePerSecond"), // CDAI data feed first (sourceAData)
                        abiEncodeWithSelector_1.abiEncodeWithSelector(MockDSR.abi, "dsr"), // DSR data feed second (sourceBData)
                        MIN_SPREAD)];
                case 6:
                    rebalanceCondition = new (_b.apply(_a, [void 0, (_e.data = _g.sent(),
                            _e)]))();
                    spells = [];
                    connectorPaybackMakerVault = new GelatoCoreLib.Action({
                        addr: constants_1.constants.ConnectMaker,
                        data: abiEncodeWithSelector_1.abiEncodeWithSelector(ConnectMaker.abi, "payback", [0, dsaSdk.maxValue, 0, "534"] //TODO: use max payback and save it with setId
                        ),
                        operation: GelatoCoreLib.Operation.Delegatecall,
                    });
                    spells.push(connectorPaybackMakerVault);
                    connectorWithdrawFromMakerVault = new GelatoCoreLib.Action({
                        addr: constants_1.constants.ConnectMaker,
                        data: abiEncodeWithSelector_1.abiEncodeWithSelector(ConnectMaker.abi, "withdraw", [0, dsaSdk.maxValue, 0, "987"] //TODO: use max withdraw and save it with setId
                        ),
                        operation: GelatoCoreLib.Operation.Delegatecall,
                    });
                    spells.push(connectorWithdrawFromMakerVault);
                    connectorDepositIntoCompound = new GelatoCoreLib.Action({
                        addr: constants_1.constants.ConnectCompound,
                        data: abiEncodeWithSelector_1.abiEncodeWithSelector(ConnectCompound.abi, "deposit", [ETH_Address, eth_amount, "987", 0] //TODO: use saved withdrawn amount and save it with setId
                        ),
                        operation: GelatoCoreLib.Operation.Delegatecall,
                    });
                    spells.push(connectorDepositIntoCompound);
                    connectorBorrowFromCompound = new GelatoCoreLib.Action({
                        addr: constants_1.constants.ConnectCompound,
                        data: abiEncodeWithSelector_1.abiEncodeWithSelector(ConnectCompound.abi, "borrow", [constants_1.constants.DAI, dsaSdk.maxValue, "534", 0] //TODO: use saved withdrawn amount and save it with setId
                        ),
                        operation: GelatoCoreLib.Operation.Delegatecall,
                    });
                    spells.push(connectorBorrowFromCompound);
                    GAS_LIMIT = "4000000";
                    GAS_PRICE_CEIL = ethers_1.ethers.utils.parseUnits("1000", "gwei");
                    taskRefinanceMakerToCompoundIfBetter = new GelatoCoreLib.Task({
                        conditions: [rebalanceCondition],
                        actions: spells,
                        selfProviderGasLimit: GAS_LIMIT,
                        selfProviderGasPriceCeil: GAS_PRICE_CEIL,
                    });
                    gelatoSelfProvider = new GelatoCoreLib.GelatoProvider({
                        addr: dsaAddress,
                        //@ts-ignore
                        module: constants_1.constants.ProviderModuleDSA,
                    });
                    _d = (_c = gelatoCore).stakeExecutor;
                    _f = {};
                    return [4 /*yield*/, gelatoCore.minExecutorStake()];
                case 7: 
                // ======= Executor Setup =========
                // For local Testing purposes our test User account will play the role of the Gelato
                // Executor network because this logic is non-trivial to fork into a local instance
                return [4 /*yield*/, _d.apply(_c, [(_f.value = _g.sent(),
                            _f)])];
                case 8:
                    // ======= Executor Setup =========
                    // For local Testing purposes our test User account will play the role of the Gelato
                    // Executor network because this logic is non-trivial to fork into a local instance
                    _g.sent();
                    return [4 /*yield*/, gelatoCore.minExecProviderFunds(GAS_LIMIT, GAS_PRICE_CEIL)];
                case 9:
                    TASK_AUTOMATION_FUNDS = _g.sent();
                    return [4 /*yield*/, dsa.cast(
                        //@ts-ignore
                        [constants_1.constants.ConnectGelato], // targets
                        [
                            abiEncodeWithSelector_1.abiEncodeWithSelector(ConnectGelato_ABI, "multiProvide", [
                                userAddress,
                                [],
                                //@ts-ignore
                                [constants_1.constants.ProviderModuleDSA],
                                TASK_AUTOMATION_FUNDS,
                                0,
                                0,
                            ]),
                        ], // datas
                        userAddress, // origin
                        {
                            value: TASK_AUTOMATION_FUNDS,
                            gasLimit: 5000000,
                        })];
                case 10:
                    _g.sent();
                    expiryDate = 0;
                    return [4 /*yield*/, dsa.cast(
                        //@ts-ignore
                        [constants_1.constants.ConnectGelato], // targets
                        [
                            abiEncodeWithSelector_1.abiEncodeWithSelector(ConnectGelato_ABI, "submitTask", [
                                gelatoSelfProvider,
                                taskRefinanceMakerToCompoundIfBetter,
                                expiryDate,
                            ]),
                        ], // datas
                        userAddress, // origin
                        {
                            gasLimit: 5000000,
                        })];
                case 11:
                    _g.sent();
                    return [4 /*yield*/, gelatoCore.currentTaskReceiptId()];
                case 12:
                    taskReceiptId = _g.sent();
                    return [2 /*return*/, new GelatoCoreLib.TaskReceipt({
                            id: taskReceiptId,
                            userProxy: dsaAddress,
                            provider: gelatoSelfProvider,
                            tasks: [taskRefinanceMakerToCompoundIfBetter],
                            expiryDate: expiryDate,
                        })];
            }
        });
    });
}
exports.createGelatoOptimizer = createGelatoOptimizer;
//# sourceMappingURL=createGelatoOptimizer.js.map