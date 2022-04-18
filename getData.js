const Web3 = require("web3");

const poolAbi = require("./pool.json");
const tokenAbi = require("./erc20.json");
const tokenTracker = require("./tokenTracker.json");
const threemStakingAbi = require("./locked3monthsabi.json");

const readline = require("readline-sync");

let web3;

const provider = new Web3.providers.HttpProvider(
  "https://mainnet.infura.io/v3/287af69fca9142f3b1681a93ce4c3afa"
);
web3 = new Web3(provider);

const TokenTrackerAddress = "0xfB85B9Ec50560e302Ab106F1E2857d95132120D0";
const TokenTracker2Address = "0xb267DeaACe0B8c5FcB2bb04801A364e7Af7DA3F4";
const SDAO = "0x993864E43Caa7F7F12953AD6fEb1d1Ca635B875F";
const NTX = "0xF0d33BeDa4d734C72684b5f9abBEbf715D0a7935";
const B_SDAO_3m_address = "0x74641ed232dbB8CBD9847484dD020d44453F0368";
const B_SDAO_6m_address = "0xF5738B4aD2f8302b926676692a0C09603d930b42";
const B_NTX_3m_address = "0x502B965d3D51d4FD531E6A1c1fA9bFA50337bA55";
const WETHNTXpoolAddress="0xB3D994978D2Bc50d2ce74c45FcD923E7C9c06730";


const SDAO_instance = new web3.eth.Contract(tokenAbi, SDAO);
const NTX_instance = new web3.eth.Contract(tokenAbi, NTX);



async function Token0(
  token0contract,
  LptokensReceived,
  totalsupplyoflp,
  tokenReserve,
  LpDecimal
) {
  let Decimal0 = await token0contract.methods.decimals().call();
  totalsupplyoflp = totalsupplyoflp / 10 ** Decimal0;
  let token0Reserve = tokenReserve[0];
  token0Reserve = token0Reserve / 10 ** Decimal0;
  LptokensReceived = LptokensReceived / 10 ** Decimal0;
  let token0amount = (LptokensReceived / totalsupplyoflp) * token0Reserve;
  token0amount = token0amount.toFixed(2);

  return token0amount;
}

async function Token1(
  token1contract,
  LptokensReceived,
  totalsupplyoflp,
  tokenReserve,
  LpDecimal
) {
  let Decimal1 = await token1contract.methods.decimals().call();
  let totalSupplytoken1 = totalsupplyoflp / 10 ** Decimal1;
  let token1Reserve = tokenReserve[1] / 10 ** Decimal1;
  let LptokensReceivedtoken1 = LptokensReceived / 10 ** Decimal1;
  let token1amount =
    (LptokensReceivedtoken1 / totalSupplytoken1) * token1Reserve;
  token1amount = token1amount.toFixed(2);

  return token1amount;
}

async function getData1(address) {
 const TT_instance = new web3.eth.Contract(tokenTracker, TokenTrackerAddress);

  const poolLength = await TT_instance.methods.poolLength().call();

  for (let i = 1; i < poolLength; i++) {
    const LP = await TT_instance.methods.lpToken(i).call();

    LPInstance = new web3.eth.Contract(poolAbi, LP);

    let LptokensReceived = await TT_instance.methods
      .userInfo(i, address)
      .call();
    LptokensReceived = LptokensReceived.amount;

    let LpDecimal = await LPInstance.methods.decimals().call();
    let totalsupplyoflp = await LPInstance.methods.totalSupply().call();
    var tokenReserve = await LPInstance.methods.getReserves().call();

    var token0 = await LPInstance.methods.token0().call();
    var token1 = await LPInstance.methods.token1().call();
    const token0contract = new web3.eth.Contract(tokenAbi, token0);
    const token1contract = new web3.eth.Contract(tokenAbi, token1);
    let Symbol0 = await token0contract.methods.symbol().call();
    let Symbol1 = await token1contract.methods.symbol().call();

    let token0amount = await Token0(
      token0contract,
      LptokensReceived,
      totalsupplyoflp,
      tokenReserve,
      LpDecimal
    );
    let token1amount = await Token1(
      token1contract,
      LptokensReceived,
      totalsupplyoflp,
      tokenReserve,
      LpDecimal
    );
    if ((token0amount != 0, token1amount != 0)) {
      let rewards = await TT_instance.methods.pendingRewards(i, address).call();

      let rewardTokenAddress = await TT_instance.methods.rewardsToken().call();
      rewardTokencontract = new web3.eth.Contract(tokenAbi, rewardTokenAddress);
      let rewardtokenDecimals = await rewardTokencontract.methods
        .decimals()
        .call();
      let rewardsTokenSymbol = await rewardTokencontract.methods
        .symbol()
        .call();
      console.log(Symbol0, "+", Symbol1, token0amount, "+", token1amount);
      console.log(
        "rewards:",
        (rewards / 10 ** rewardtokenDecimals).toFixed(2),
        rewardsTokenSymbol
      );
    }
  }
}

async function getData2(address) {
  const TT_instance = new web3.eth.Contract(tokenTracker, TokenTrackerAddress);
  const B_SDAO_3m_INSTANCE = new web3.eth.Contract(
    threemStakingAbi,
    B_SDAO_3m_address
  );
  const B_SDAO_6m_INSTANCE = new web3.eth.Contract(
    threemStakingAbi,
    B_SDAO_6m_address
  );

  const info = await TT_instance.methods.userInfo(0, address).call();
  let balance = info.amount;
  const decimals = await SDAO_instance.methods.decimals().call();
  let rewards = await TT_instance.methods.pendingRewards(0, address).call();

  balance = (balance / 10 ** decimals).toFixed(2);
  rewards = (rewards / 10 ** decimals).toFixed(2);

  let stake3m = await B_SDAO_3m_INSTANCE.methods.balances(address).call();
  stake3m = (stake3m / 10 ** decimals).toFixed(2);

  let stake6m = await B_SDAO_6m_INSTANCE.methods.balances(address).call();
  stake6m = (stake6m / 10 ** decimals).toFixed(2);

  if(balance1=0 || stake3m!=0 || stake6m!=0){
  console.log("SDAO staking:");
  if(balance!=0)
  console.log("balance:", balance, "rewards:", rewards);
  if(stake3m!=0)
  console.log("SDAO-3m-balance:", stake3m);
  if(stake6m!=0)
  console.log("SDAO-6m-balance:", stake6m);
  }
}

async function getData3(address) {
const TT_instance2 = new web3.eth.Contract(tokenTracker, TokenTracker2Address);

const B_NTX_3m_INSTANCE = new web3.eth.Contract(
  threemStakingAbi,
  B_NTX_3m_address
);

  const info = await TT_instance2.methods.userInfo(1, address).call();
  let balance = info.amount;
  const decimals = await NTX_instance.methods.decimals().call();
  let rewards = await TT_instance2.methods.pendingRewards(1, address).call();

  balance = (balance / 10 ** decimals).toFixed(2);
  rewards = (rewards / 10 ** decimals).toFixed(2);
  
  let stake = await B_NTX_3m_INSTANCE.methods.balances(address).call();
  stake = (stake / 10 ** decimals).toFixed(2);

  if(balance!=0 || stake!=0){
  console.log("NTX staking:");
  if(balance!=0)
  console.log("balance:", balance, "rewards:", rewards);
  if(stake!=0)
  console.log("NTX-3m-balance:", stake);
  }
}

async function getData4(address){

    const WETHNTX_pool_instance=new web3.eth.Contract(
        poolAbi,
        WETHNTXpoolAddress
      )
const TT_instance2 = new web3.eth.Contract(tokenTracker, TokenTracker2Address);

      

    let LptokensReceived=await TT_instance2.methods.userInfo(0,address).call();
  LptokensReceived=LptokensReceived.amount;


  let LpDecimal=await WETHNTX_pool_instance.methods.decimals().call();
  let totalsupplyoflp=await WETHNTX_pool_instance.methods.totalSupply().call();
  var tokenReserve = await WETHNTX_pool_instance.methods.getReserves().call();


  var token0 = await WETHNTX_pool_instance.methods.token0().call();
  var token1 = await WETHNTX_pool_instance.methods.token1().call();
  const token0contract = new web3.eth.Contract(tokenAbi, token0);
    const token1contract = new web3.eth.Contract(poolAbi, token1);

  let token0amount=await Token0(token0contract,LptokensReceived,totalsupplyoflp,tokenReserve,LpDecimal);
  let token1amount=await Token1(token1contract,LptokensReceived,totalsupplyoflp,tokenReserve,LpDecimal);
  if ((token0amount != 0, token1amount != 0)){
      


      let rewards=await TT_instance2.methods.pendingRewards(0,address).call();

      let rewardTokenAddress=await TT_instance2.methods.rewardsToken().call();
      rewardTokencontract=new web3.eth.Contract(tokenAbi,rewardTokenAddress);
      let rewardtokenDecimals=await rewardTokencontract.methods.decimals().call();
      let rewardsTokenSymbol=await rewardTokencontract.methods.symbol().call();
      console.log("WETH", "+", "NTX", token0amount, "+", token1amount);
      console.log('rewards:',(rewards/10**rewardtokenDecimals).toFixed(2),rewardsTokenSymbol)
  }
}

let address = "0x0ad7a09575e3ec4c109c4faa3be7cdafc5a4adba";
getData1(address);
getData2(address);
getData3(address);
getData4(address);
