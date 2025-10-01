interface TradeData {
  currentPrice?: string;
  collateral?: string;
  leverage?: string;
  positionSize?: string;
  tradeSide?: "long" | "short";
}

const getTradeData = (): TradeData => {
  const currentPriceEl = document.querySelector(
    '[data-testid="place-order-limit-price-input"]',
  ) as HTMLInputElement;
  const collateralEl = document.querySelector(
    '[data-testid="collateral-input"]',
  ) as HTMLInputElement;
  const leverageEl = document.querySelector(
    '[data-testid="leverage-input"]',
  ) as HTMLInputElement;
  const positionSizeEl = document.querySelector(
    '[data-sentry-component="SizeDisplay"]',
  ) as HTMLElement;
  const longButton = document.querySelector(
    '[data-sentry-component="TradeSideTabs"] > div:first-child',
  );

  const tradeSide = longButton?.classList.contains("outline")
    ? "long"
    : "short";

  return {
    currentPrice: currentPriceEl?.value,
    collateral: collateralEl?.value,
    leverage: leverageEl?.value,
    positionSize: positionSizeEl?.innerText,
    tradeSide: tradeSide,
  };
};

const fillTradeForm = (data: any) => {
  const collateralEl = document.querySelector(
    '[data-testid="collateral-input"]',
  ) as HTMLInputElement;
  const leverageEl = document.querySelector(
    '[data-testid="leverage-input"]',
  ) as HTMLInputElement;
  const longButton = document.querySelector(
    '[data-sentry-component="TradeSideTabs"] > div:first-child',
  ) as HTMLElement;
  const shortButton = document.querySelector(
    '[data-sentry-component="TradeSideTabs"] > div:last-child',
  ) as HTMLElement;

  if (data.collateral && collateralEl) {
    collateralEl.value = data.collateral;
    collateralEl.dispatchEvent(new Event("input", { bubbles: true }));
  }
  if (data.leverage && leverageEl) {
    leverageEl.value = data.leverage;
    leverageEl.dispatchEvent(new Event("input", { bubbles: true }));
  }
  if (data.action === "long" && longButton) {
    longButton.click();
  }
  if (data.action === "short" && shortButton) {
    shortButton.click();
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getTradeData") {
    console.log(sender);
    const tradeData = getTradeData();
    sendResponse(tradeData);
  } else if (request.action === "fillTradeForm") {
    fillTradeForm(request.data);
    sendResponse({ status: "done" });
  }
  return true;
});

console.log("Content script loaded and listening.");
