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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMakerVault = void 0;
var ethers_1 = require("ethers");
var dsa_sdk_1 = __importDefault(require("dsa-sdk"));
var abiEncodeWithSelector_1 = require("./utils/abiEncodeWithSelector");
var constants_1 = require("../constants/constants");
var ConnectMaker = require("../../pre-compiles/ConnectMaker.json");
var InstaAccount = require("../../pre-compiles/InstaAccount.json");
function createMakerVault(web3, dsaAddress, eth_amount, dai_amount) {
    return __awaiter(this, void 0, void 0, function () {
        var provider, userWallet, userAddress, dsaSdk, dsa, gasLimit, gasPrice, openVaultData, depositEthData, borrowDaiData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    provider = new ethers_1.ethers.providers.Web3Provider(web3.currentProvider);
                    return [4 /*yield*/, provider.getSigner()];
                case 1:
                    userWallet = _a.sent();
                    return [4 /*yield*/, userWallet.getAddress()];
                case 2:
                    userAddress = _a.sent();
                    dsaSdk = new dsa_sdk_1.default(web3);
                    dsa = new ethers_1.Contract(dsaAddress, InstaAccount.abi, userWallet);
                    gasLimit = ethers_1.BigNumber.from(1000000);
                    gasPrice = ethers_1.utils.parseUnits("20", "gwei");
                    // First send ETH to the DSA
                    return [4 /*yield*/, userWallet.sendTransaction({
                            to: dsaAddress,
                            value: eth_amount,
                            gasLimit: gasLimit,
                            gasPrice: gasPrice,
                        })];
                case 3:
                    // First send ETH to the DSA
                    _a.sent();
                    openVaultData = abiEncodeWithSelector_1.abiEncodeWithSelector(ConnectMaker.abi, "open", [
                        "ETH-A",
                    ]);
                    depositEthData = abiEncodeWithSelector_1.abiEncodeWithSelector(ConnectMaker.abi, "deposit", [
                        0,
                        eth_amount,
                        0,
                        0,
                    ]);
                    borrowDaiData = abiEncodeWithSelector_1.abiEncodeWithSelector(ConnectMaker.abi, "borrow", [
                        0,
                        dai_amount,
                        0,
                        0,
                    ]);
                    // Casting it twice makes it easier for the network
                    return [4 /*yield*/, dsa.cast([
                            //@ts-ignore
                            constants_1.constants.ConnectMaker,
                            //@ts-ignore
                            constants_1.constants.ConnectMaker,
                        ], [openVaultData, depositEthData], userAddress)];
                case 4:
                    // Casting it twice makes it easier for the network
                    _a.sent();
                    return [4 /*yield*/, dsa.cast([
                            //@ts-ignore
                            constants_1.constants.ConnectMaker,
                        ], [borrowDaiData], userAddress)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, dsaSdk.maker.getVaults(dsaAddress)];
                case 6: 
                // return vaults
                return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.createMakerVault = createMakerVault;
//# sourceMappingURL=createMakerVault.js.map