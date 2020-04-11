const covid19ImpactEstimator = (data) => {
  const originalData = data;
  const {
    region,
    periodType,
    timeToElapse,
    reportedCases,
    totalHospitalBeds
  } = data;

  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = region;
  const impactResult = {};
  const severeImpactResult = {};

  // check for data-period-type
  let periodTypeValue = null;
  let days = null;
  if (periodType === 'days') {
    days = timeToElapse;
    const factor = Math.floor(days / 3);
    periodTypeValue = 2 ** factor;
  } else if (periodType === 'weeks') {
    days = 7 * timeToElapse;
    const factor = Math.floor(days / 3);
    periodTypeValue = 2 ** factor;
  } else {
    days = 30 * timeToElapse;
    const factor = days / 3;
    periodTypeValue = 2 ** factor;
  }

  impactResult.currentlyInfected = reportedCases * 10;
  severeImpactResult.currentlyInfected = reportedCases * 50;

  impactResult.infectionsByRequestedTime = reportedCases * 10 * periodTypeValue;
  severeImpactResult.infectionsByRequestedTime = reportedCases * 50 * periodTypeValue;

  // 15% of infectionsByRequestedTime impact
  const infectReqTime10 = reportedCases * 10 * periodTypeValue;
  impactResult.severeCasesByRequestedTime = (15 / 100) * infectReqTime10;

  // 15% of infectionsByRequestedTime severeImpact
  const infectReqTime50 = reportedCases * 50 * periodTypeValue;
  severeImpactResult.severeCasesByRequestedTime = (15 / 100) * infectReqTime50;

  // The number of available beds.
  const numOfAvailableBeds = (35 / 100) * totalHospitalBeds;

  // hospitalBedsByRequestedTime for impact
  const numOfSeverePatients10 = (15 / 100) * infectReqTime10;
  const temp10 = Math.trunc(numOfAvailableBeds - numOfSeverePatients10);
  impactResult.hospitalBedsByRequestedTime = temp10;

  // hospitalBedsByRequestedTime for severeImpact
  const numOfSeverePatients50 = (15 / 100) * infectReqTime50;
  const temp50 = Math.trunc(numOfAvailableBeds - numOfSeverePatients50);
  severeImpactResult.hospitalBedsByRequestedTime = temp50;

  // 5% of infectionsByRequestedTime
  impactResult.casesForICUByRequestedTime = Math.trunc((5 / 100) * infectReqTime10);
  severeImpactResult.casesForICUByRequestedTime = (5 / 100) * infectReqTime50;

  // 2% of infectionsByRequestedTime
  impactResult.casesForVentilatorsByRequestedTime = Math.trunc((2 / 100) * infectReqTime10);
  severeImpactResult.casesForVentilatorsByRequestedTime = (2 / 100) * infectReqTime50;

  // How much money the economy is likely to lose over the said period.
  const temp = avgDailyIncomePopulation * avgDailyIncomeInUSD * days;
  impactResult.dollarsInFlight = infectReqTime10 * Math.trunc(temp);
  severeImpactResult.dollarsInFlight = infectReqTime50 * temp;

  return {
    data: originalData,
    impact: impactResult,
    severeImpact: severeImpactResult
  };
};

export default covid19ImpactEstimator;
