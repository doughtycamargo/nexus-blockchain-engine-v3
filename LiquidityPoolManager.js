class LiquidityPool {
  constructor(tokenA, tokenB, fee = 0.003) {
    this.tokenA = tokenA;
    this.tokenB = tokenB;
    this.reserveA = 0;
    this.reserveB = 0;
    this.fee = fee;
    this.lpTokens = new Map();
  }

  addLiquidity(from, amountA, amountB) {
    this.tokenA.transfer(from, 'pool', amountA);
    this.tokenB.transfer(from, 'pool', amountB);
    this.reserveA += amountA;
    this.reserveB += amountB;
    const lp = Math.sqrt(amountA * amountB);
    this.lpTokens.set(from, (this.lpTokens.get(from) || 0) + lp);
  }

  removeLiquidity(from, lpAmount) {
    const total = Array.from(this.lpTokens.values()).reduce((a, b) => a + b, 0);
    const share = lpAmount / total;
    const amtA = this.reserveA * share;
    const amtB = this.reserveB * share;
    this.tokenA.transfer('pool', from, amtA);
    this.tokenB.transfer('pool', from, amtB);
    this.reserveA -= amtA;
    this.reserveB -= amtB;
    this.lpTokens.set(from, this.lpTokens.get(from) - lpAmount);
  }

  swapAtoB(from, amountIn) {
    const amountInWithFee = amountIn * (1 - this.fee);
    const amountOut = (this.reserveB * amountInWithFee) / (this.reserveA + amountInWithFee);
    this.tokenA.transfer(from, 'pool', amountIn);
    this.tokenB.transfer('pool', from, amountOut);
    this.reserveA += amountIn;
    this.reserveB -= amountOut;
    return amountOut;
  }
}

module.exports = LiquidityPool;
