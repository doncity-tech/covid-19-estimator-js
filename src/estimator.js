
const covid19ImpactEstimator = (data) => {
    let originalData = data;
    const {
        region,
        periodType,
        reportedCases,
        totalHospitalBeds
    } = data;

    const {
        avgDailyIncomeInUSD,
        avgDailyIncomePopulation
    } = region;

    let impactResult = {};
    let severeImpactResult = {};

    // check for data-period-type
    let periodTypeValue, days;
    if (periodType === 'days') {
        days = 30;
        periodTypeValue = 1024;
    } else if (periodType === 'weeks') {
        let week = 4;
        days = 7 * week;
        let factor = days / 3;
        periodTypeValue = Math.pow(2, factor);
    } else {
        let month = 1;
        days = 30 * month;
        let factor = days / 3;
        periodTypeValue = Math.pow(2, factor);
    }

    impactResult.currentlyInfected = reportedCases * 10;
    severeImpactResult.currentlyInfected = reportedCases * 50;

    impactResult.infectionsByRequestedTime = (reportedCases * 10) * periodTypeValue;
    severeImpactResult.infectionsByRequestedTime = (reportedCases * 50) * periodTypeValue;

    //15% of infectionsByRequestedTime impact
    let infectReqTime10 = (reportedCases * 10) * periodTypeValue;
    impactResult.severeCasesByRequestedTime = (15 / 100) * infectReqTime10;

    //15% of infectionsByRequestedTime severeImpact 
    let infectReqTime50 = (reportedCases * 50) * periodTypeValue;
    severeImpactResult.severeCasesByRequestedTime = (15 / 100) * infectReqTime50;

    //The number of available beds.
    let numOfAvailableBeds = (35 / 100) * totalHospitalBeds;

    // hospitalBedsByRequestedTime for impact
    let numOfSeverePatients10 = (15 / 100) * infectReqTime10;
    impactResult.hospitalBedsByRequestedTime = numOfAvailableBeds - numOfSeverePatients10;

    // hospitalBedsByRequestedTime for severeImpact
    let numOfSeverePatients50 = (15 / 100) * infectReqTime50;
    severeImpactResult.hospitalBedsByRequestedTime = numOfAvailableBeds - numOfSeverePatients50;

    // 5% of infectionsByRequestedTime
    impactResult.casesForICUByRequestedTime = (5 / 100) * infectReqTime10;
    severeImpactResult.casesForICUByRequestedTime = (5 / 100) * infectReqTime50;

    // 2% of infectionsByRequestedTime
    impactResult.casesForVentilatorsByRequestedTime = (2 / 100) * infectReqTime10;
    severeImpactResult.casesForVentilatorsByRequestedTime = (2 / 100) * infectReqTime50;

    // How much money the economy is likely to lose over the said period.
    impactResult.dollarsInFlight = infectReqTime10 * avgDailyIncomePopulation * avgDailyIncomeInUSD * days;
    severeImpactResult.dollarsInFlight = infectReqTime50 * avgDailyIncomePopulation * avgDailyIncomeInUSD * days;

    return {
        data: originalData,
        impact: impactResult,
        severeImpact: severeImpactResult
    }
};

export default covid19ImpactEstimator;