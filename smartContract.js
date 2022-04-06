const Web3 = require("web3");

const poolAbi = require("./pool.json");
const unbondedAbi=require('./unbondedStakingAbi.json');
const threemStakingAbi=require('./locked3monthsabi.json');
const sixmStakingAbi=require('./locked6monthsabi.json');
const tokenAbi=require('./erc20.json');
const tokenTracker=require('./tokenTracker.json');


const readline = require("readline-sync");

let web3;

const provider = new Web3.providers.HttpProvider(
  "https://mainnet.infura.io/v3/287af69fca9142f3b1681a93ce4c3afa"
);
web3 = new Web3(provider);

const WETHNTXpoolAddress="0xB3D994978D2Bc50d2ce74c45FcD923E7C9c06730";
const WETHNTX_TTAddress="0xb267DeaACe0B8c5FcB2bb04801A364e7Af7DA3F4";

const TokenTracker2Address="0xfB85B9Ec50560e302Ab106F1E2857d95132120D0";
const WETHSDAO_address="0x424485f89ea52839fdB30640Eb7DD7E0078E12fb";
const WETHNTX2_address="0xe45b4a84E0aD24B8617a489d743c52B84B7aCeBE";
const SDAOUSDT_address="0x3A925503970D40D36D2329e3846E09fcfc9b6aCB";
const AGIXUSDT_address="0x4bB0925FA50Da9B4c8936869433b48e78cCc5c13";

const UB_SDAO_address="0xfB85B9Ec50560e302Ab106F1E2857d95132120D0";
const UB_NTX_address="0xb267DeaACe0B8c5FcB2bb04801A364e7Af7DA3F4";
const B_SDAO_3m_address="0x74641ed232dbB8CBD9847484dD020d44453F0368";
const B_NTX_3m_address="0x502B965d3D51d4FD531E6A1c1fA9bFA50337bA55";
const B_SDAO_6m_address="0xF5738B4aD2f8302b926676692a0C09603d930b42";
const SDAO="0x993864E43Caa7F7F12953AD6fEb1d1Ca635B875F";
const NTX="0xF0d33BeDa4d734C72684b5f9abBEbf715D0a7935";


const UB_SDAO_INSTANCE = new web3.eth.Contract(
  unbondedAbi,
  UB_SDAO_address
);
const UB_NTX_INSTANCE = new web3.eth.Contract(
  unbondedAbi,
  UB_NTX_address
);
const B_SDAO_3m_INSTANCE = new web3.eth.Contract(
  threemStakingAbi,
  B_SDAO_3m_address
);
const B_NTX_3m_INSTANCE = new web3.eth.Contract(
  threemStakingAbi,
  B_NTX_3m_address
);
const B_SDAO_6m_INSTANCE = new web3.eth.Contract(
  sixmStakingAbi,
  B_SDAO_6m_address
);
const SDAO_instance=new web3.eth.Contract(
  tokenAbi,
  SDAO
)
const NTX_instance=new web3.eth.Contract(
  tokenAbi,
  NTX
)

const WETHNTX_TT_instance=new web3.eth.Contract(
  tokenTracker,
  WETHNTX_TTAddress
)
const WETHNTX_pool_instance=new web3.eth.Contract(
  poolAbi,
  WETHNTXpoolAddress
)
const WETHNTX_pool_instance2=new web3.eth.Contract(
  poolAbi,
  WETHNTX2_address
)

const TT_instance=new web3.eth.Contract(
  tokenTracker,
  TokenTracker2Address
)
const WETHSDAO_pool_instance=new web3.eth.Contract(
  poolAbi,
  WETHSDAO_address
)
const SDAOUSDT_pool_instance=new web3.eth.Contract(
  poolAbi,
  SDAOUSDT_address
)
const AGIXUSDT_pool_instance=new web3.eth.Contract(
  poolAbi,
  AGIXUSDT_address
)




async function getBalanceSDAO(address) {
  
  

  const decimals=await SDAO_instance.methods.decimals().call();
  let stake=await UB_SDAO_INSTANCE.methods.userInfo(0,address).call();
  stake=(stake.amount/10**decimals).toFixed(2)
  
  const reward= await UB_SDAO_INSTANCE.methods.pendingRewards(0,address).call();
  console.log('SDAO-balance:',stake);
  console.log('SDAO-rewards:',(reward/10**decimals).toFixed(2));

}
async function getBalanceNTX(address) {
  

  const decimals=await NTX_instance.methods.decimals().call();
  let stake=await UB_NTX_INSTANCE.methods.userInfo(1,address).call();
  stake=(stake.amount/10**decimals).toFixed(2);
  
  const reward= await UB_NTX_INSTANCE.methods.pendingRewards(1,address).call();
  console.log('NTX-balance:',stake);
  console.log('NTX-rewards:',(reward/10**decimals).toFixed(2));

}

async function getBalanceSDAO3m(address) {
  

  const decimals=await SDAO_instance.methods.decimals().call();
  let stake=await B_SDAO_3m_INSTANCE.methods.balances(address).call();
  stake=(stake/10**decimals).toFixed(2);
  console.log('SDAO-3m-balance:',stake);


}

async function getBalanceNTX3m(address) {
  

  const decimals=await NTX_instance.methods.decimals().call();
  let stake=await B_NTX_3m_INSTANCE.methods.balances(address).call();
  stake=(stake/10**decimals).toFixed(2);
  console.log('NTX-3m-balance:',stake);


}

async function getBalanceSDAO6m(address) {
  

  const decimals=await SDAO_instance.methods.decimals().call();
  let stake=await B_SDAO_6m_INSTANCE.methods.balances(address).call();
  stake=(stake/10**decimals).toFixed(2);
  console.log('SDAO-6m-balance:',stake);


}


async function Token0(token0,LptokensReceived,totalsupplyoflp,tokenReserve,LpDecimal){
  const token0contract = new web3.eth.Contract(tokenAbi, token0);
    let Symbol0 = await token0contract.methods.symbol().call();
    let Decimal0 = await token0contract.methods.decimals().call();
    totalsupplyoflp = totalsupplyoflp / 10 ** Decimal0;
    let token0Reserve = tokenReserve[0];
    token0Reserve = token0Reserve / 10 ** Decimal0;
    LptokensReceived = LptokensReceived / 10 ** Decimal0;
    let token0amount = (LptokensReceived / totalsupplyoflp) * token0Reserve;
    token0amount = token0amount.toFixed(2);
   


    return token0amount;
}

async function Token1(token1,LptokensReceived,totalsupplyoflp,tokenReserve,LpDecimal){
  const token1contract = new web3.eth.Contract(poolAbi, token1);
  let Symbol1 = await token1contract.methods.symbol().call();
  let Decimal1 = await token1contract.methods.decimals().call();
  let totalSupplytoken1 = totalsupplyoflp / 10 ** Decimal1;
  let token1Reserve = tokenReserve[1] / 10 ** Decimal1;
  let LptokensReceivedtoken1 = LptokensReceived / 10 ** Decimal1;
  let token1amount =
    (LptokensReceivedtoken1 / totalSupplytoken1) * token1Reserve;
  token1amount = token1amount.toFixed(2);


  return token1amount;
}

async function getBalanceWETHSDAO(address) {
  

  let LptokensReceived=await TT_instance.methods.userInfo(1,address).call();
  LptokensReceived=LptokensReceived.amount;


  let LpDecimal=await WETHSDAO_pool_instance.methods.decimals().call();
  let totalsupplyoflp=await WETHSDAO_pool_instance.methods.totalSupply().call();
  var tokenReserve = await WETHSDAO_pool_instance.methods.getReserves().call();


  var token0 = await WETHSDAO_pool_instance.methods.token0().call();
  var token1 = await WETHSDAO_pool_instance.methods.token1().call();

  let token0amount=await Token0(token0,LptokensReceived,totalsupplyoflp,tokenReserve,LpDecimal);
  let token1amount=await Token1(token1,LptokensReceived,totalsupplyoflp,tokenReserve,LpDecimal);
  if ((token0amount != 0, token1amount != 0)){
     


      let rewards=await TT_instance.methods.pendingRewards(1,address).call();

      let rewardTokenAddress=await TT_instance.methods.rewardsToken().call();
      rewardTokencontract=new web3.eth.Contract(tokenAbi,rewardTokenAddress);
      let rewardtokenDecimals=await rewardTokencontract.methods.decimals().call();
      let rewardsTokenSymbol=await rewardTokencontract.methods.symbol().call();
      console.log("WETH", "+", "SDAO", token0amount, "+", token1amount);
      console.log('rewards:',(rewards/10**rewardtokenDecimals).toFixed(2),rewardsTokenSymbol)
  }

}

async function getBalanceWETHNTX(address) {
  

  let LptokensReceived=await TT_instance.methods.userInfo(2,address).call();
  LptokensReceived=LptokensReceived.amount;


  let LpDecimal=await WETHNTX_pool_instance2.methods.decimals().call();
  let totalsupplyoflp=await WETHNTX_pool_instance2.methods.totalSupply().call();
  var tokenReserve = await WETHNTX_pool_instance2.methods.getReserves().call();


  var token0 = await WETHNTX_pool_instance2.methods.token0().call();
  var token1 = await WETHNTX_pool_instance2.methods.token1().call();

  let token0amount=await Token0(token0,LptokensReceived,totalsupplyoflp,tokenReserve,LpDecimal);
  let token1amount=await Token1(token1,LptokensReceived,totalsupplyoflp,tokenReserve,LpDecimal);
  if ((token0amount != 0, token1amount != 0)){
      


      let rewards=await TT_instance.methods.pendingRewards(1,address).call();

      let rewardTokenAddress=await TT_instance.methods.rewardsToken().call();
      rewardTokencontract=new web3.eth.Contract(tokenAbi,rewardTokenAddress);
      let rewardtokenDecimals=await rewardTokencontract.methods.decimals().call();
      let rewardsTokenSymbol=await rewardTokencontract.methods.symbol().call();
      console.log("WETH", "+", "NTX", token0amount, "+", token1amount);
      console.log('rewards:',(rewards/10**rewardtokenDecimals).toFixed(2),rewardsTokenSymbol)
  }
}


async function getBalanceAGIXUSDT(address) {
  

  let LptokensReceived=await TT_instance.methods.userInfo(4,address).call();
  LptokensReceived=LptokensReceived.amount;


  let LpDecimal=await AGIXUSDT_pool_instance.methods.decimals().call();
  let totalsupplyoflp=await AGIXUSDT_pool_instance.methods.totalSupply().call();
  var tokenReserve = await AGIXUSDT_pool_instance.methods.getReserves().call();


  var token0 = await AGIXUSDT_pool_instance.methods.token0().call();
  var token1 = await AGIXUSDT_pool_instance.methods.token1().call();

  let token0amount=await Token0(token0,LptokensReceived,totalsupplyoflp,tokenReserve,LpDecimal);
  let token1amount=await Token1(token1,LptokensReceived,totalsupplyoflp,tokenReserve,LpDecimal);
  if ((token0amount != 0, token1amount != 0)){
      

      let rewards=await TT_instance.methods.pendingRewards(4,address).call();

      let rewardTokenAddress=await TT_instance.methods.rewardsToken().call();
      rewardTokencontract=new web3.eth.Contract(tokenAbi,rewardTokenAddress);
      let rewardtokenDecimals=await rewardTokencontract.methods.decimals().call();
      let rewardsTokenSymbol=await rewardTokencontract.methods.symbol().call();
      console.log("AGIX", "+", "USDT", token0amount, "+", token1amount);

      console.log('rewards:',(rewards/10**rewardtokenDecimals).toFixed(2),rewardsTokenSymbol)
  }
}


async function getBalanceSDAOUSDT(address) {
  

  let LptokensReceived=await TT_instance.methods.userInfo(3,address).call();
  LptokensReceived=LptokensReceived.amount;


  let LpDecimal=await SDAOUSDT_pool_instance.methods.decimals().call();
  let totalsupplyoflp=await SDAOUSDT_pool_instance.methods.totalSupply().call();
  var tokenReserve = await SDAOUSDT_pool_instance.methods.getReserves().call();


  var token0 = await SDAOUSDT_pool_instance.methods.token0().call();
  var token1 = await SDAOUSDT_pool_instance.methods.token1().call();

  let token0amount=await Token0(token0,LptokensReceived,totalsupplyoflp,tokenReserve,LpDecimal);
  let token1amount=await Token1(token1,LptokensReceived,totalsupplyoflp,tokenReserve,LpDecimal);
  if ((token0amount != 0, token1amount != 0)){
     

      let rewards=await TT_instance.methods.pendingRewards(3,address).call();

      let rewardTokenAddress=await TT_instance.methods.rewardsToken().call();
      rewardTokencontract=new web3.eth.Contract(tokenAbi,rewardTokenAddress);
      let rewardtokenDecimals=await rewardTokencontract.methods.decimals().call();
      let rewardsTokenSymbol=await rewardTokencontract.methods.symbol().call();
      console.log("SDAO", "+", "USDT", token0amount, "+", token1amount);

      console.log('rewards:',(rewards/10**rewardtokenDecimals).toFixed(2),rewardsTokenSymbol)
  }

}

async function getBalanceWETHNTX2(address) {
  

  let LptokensReceived=await WETHNTX_TT_instance.methods.userInfo(0,address).call();
  LptokensReceived=LptokensReceived.amount;
  let LpDecimal=await WETHNTX_pool_instance.methods.decimals().call();
  let totalsupplyoflp=await WETHNTX_pool_instance.methods.totalSupply().call();
  var tokenReserve = await WETHNTX_pool_instance.methods.getReserves().call();


  var token0 = await WETHNTX_pool_instance.methods.token0().call();
  var token1 = await WETHNTX_pool_instance.methods.token1().call();

    //////////////for first token/////////////////////
    const token0contract = new web3.eth.Contract(tokenAbi, token0);
    var Symbol0 = await token0contract.methods.symbol().call();
    var Decimal0 = await token0contract.methods.decimals().call();
    totalsupplyoflp = totalsupplyoflp / 10 ** Decimal0;
    var token0Reserve = tokenReserve[0];
    token0Reserve = token0Reserve / 10 ** Decimal0;
    LptokensReceived = LptokensReceived / 10 ** LpDecimal;
    var token0amount = (LptokensReceived / totalsupplyoflp) * token0Reserve;
    token0amount = token0amount.toFixed(2);
    /////////////// for second token//////////////////////////////////////////////
    const token1contract = new web3.eth.Contract(poolAbi, token1);
    var Symbol1 = await token1contract.methods.symbol().call();
    var Decimal1 = await token1contract.methods.decimals().call();
    var totalSupplytoken1 = totalsupplyoflp / 10 ** Decimal1;
    var token1Reserve = tokenReserve[1] / 10 ** Decimal1;
    var LptokensReceivedtoken1 = LptokensReceived / 10 ** Decimal1;
    var token1amount =
      (LptokensReceivedtoken1 / totalSupplytoken1) * token1Reserve;
    token1amount = token1amount.toFixed(2);
    
    if ((token0amount != 0, token1amount != 0)){
      

  let rewards=await WETHNTX_TT_instance.methods.pendingRewards(0,address).call();

  let rewardTokenAddress=await WETHNTX_TT_instance.methods.rewardsToken().call();
  rewardTokencontract=new web3.eth.Contract(tokenAbi,rewardTokenAddress);
  let rewardtokenDecimals=await rewardTokencontract.methods.decimals().call();
  let rewardsTokenSymbol=await rewardTokencontract.methods.symbol().call();
  console.log(Symbol0, "+", Symbol1, token0amount, "+", token1amount);
  console.log('rewards:',(rewards/10**rewardtokenDecimals).toFixed(2),rewardsTokenSymbol)

    }


  // stake=(stake/10**decimals).toFixed(2);
  


}

let address = readline.question("enter address:");
getBalanceSDAO(address);
getBalanceNTX(address);
getBalanceSDAO3m(address);
getBalanceNTX3m(address);
getBalanceSDAO6m(address);
getBalanceWETHNTX2(address);
getBalanceWETHSDAO(address);
getBalanceWETHNTX(address);
getBalanceSDAOUSDT(address);
getBalanceAGIXUSDT(address);




