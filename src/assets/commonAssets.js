import { endOfMonth, endOfYear, startOfToday, eachMonthOfInterval, startOfMonth, startOfYear, subMonths, subYears } from "date-fns";

const monthsInYear = eachMonthOfInterval({
	start: startOfYear(startOfToday()),
	end: endOfYear(startOfToday()),
})
//general contact titles
const TITLES_LIST = ["Mr", "Prof", "Hon", "Sir", "Mrs", "Miss", "Dr", "Madam", "Other"]
const GENDERS_LIST = ["Male", "Female", "Unspecified"];
const EXPENSES_CATEGORIES = [
	'Security Deposit Refund',
	'Water Deposit Refund',
	'Management Fees',
	'Utilities',
	'Taxes',
	'Mortgage',
	'Office',
	'Maintenance & Cleaning',
	'Advertising',
	'Insurance',
	'Legal & Other Professional Fees',
	'Auto & Travel',
	'Supplies',
	'Other Refund',
	'Repairs',
	'Other'
]
const PROPRERTY_TYPES = [
	"Residential",
	"Condo/Townhouse",
	"Multi-family",
	"Single-family",
]
const UNIT_TYPES = [
	"Bed Sitter",
	"One Bedroom",
	"Two Bedroom",
	"Single Room",
	"Double Room",
	"Shop",
	"Other",
];
const LEASE_OPTIONS = [
	"Fixed",
	"Fixed w/rollover",
];
const METER_TYPES = ["Electric", "Sewer", "Water"];
const FREQUENCY_OPTIONS = ["Per Day", "Week", "Month", "Quarter", "Half Year", "Year"];
const PAYMENT_FREQUENCY_OPTIONS = ["Daily", "Weekly", "Monthly", "Quarterly", "Half-Yearly", "Yearly"];

//functions to get the above values
export function getContactTitles() {
	return TITLES_LIST;
}

export function getGendersList() {
	return GENDERS_LIST;
}

export function getExpensesCategories() {
	return EXPENSES_CATEGORIES;
}

//general property types
export function getPropertyTypes() {
	return PROPRERTY_TYPES;
}

//general unit types
export function getUnitTypes() {
	return UNIT_TYPES;
}

export function getPropertyBaths() {
	const baths = [];
	for (let i = 1; i <= 5; i++) {
		baths.push(i);
	}
	return baths.concat("5+");
}

export function getPropertyBeds() {
	const beds = [];
	for (let i = 1; i <= 5; i++) {
		beds.push(i);
	}
	return beds;
}

export function getFrequencyOptions() {
	return FREQUENCY_OPTIONS;
}

export function getMeterTypes() {
	return METER_TYPES;
}

export function getLeaseOptions() {
	return LEASE_OPTIONS;
}

export function getPaymentOptions() {
	return PAYMENT_FREQUENCY_OPTIONS;
}

export function getTransactionsFilterOptions() {
	return [
		{ id: 'month-to-date', text: 'Month To Date' }, { id: 'last-month', text: 'Last Month' },
		{ id: '3-months-to-date', text: '3 Months To Date' }, { id: 'year-to-date', text: 'Year To Date' },
		{ id: 'last-year', text: 'Last Year' },];
}

export function getLastMonthFromToDates() {
	return [startOfMonth(subMonths(startOfToday(), 1)), endOfMonth(subMonths(startOfToday(), 1))]
}

export function getLastYearFromToDates() {
	return [startOfYear(subYears(startOfToday(), 1)), endOfYear(subYears(startOfToday(), 1))]
}

export function getYearToDateFromToDates() {
	return [startOfYear(startOfToday()), startOfToday()]
}

export function getCurrentMonthFromToDates() {
	return [startOfMonth(startOfToday()), endOfMonth(startOfToday())]
}

export function getLastThreeMonthsFromToDates() {
	return [startOfMonth(subMonths(startOfToday(), 2)), endOfMonth(startOfToday())]
}

export function getMonthsInYear() {
	return monthsInYear
}

// Create our number formatter.
export const currencyFormatter = new Intl.NumberFormat(undefined, {
	style: 'decimal',
	currency: 'KES',
});
