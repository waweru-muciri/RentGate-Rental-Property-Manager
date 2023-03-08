//general contact titles
export function getContactTitles() {
	return ["Mr", "Prof", "Hon", "Sir", "Mrs", "Miss", "Dr", "Madam", "Other"];
}

export function getGendersList() {
	let gendersList = ["Male", "Female", "Not Specified"];
	return gendersList;
}

export function getExpensesCategories() {
	return [
		'Taxes',
		'Utilities',
		'Mortgage',
		'Office',
		'Entertainment',
		'Maintenance & Cleaning',
		'Advertising',
		'Insurance',
		'Legal & Other Professional Fees',
		'Auto & Travel',
		'Management Fees',
		'Supplies',
		'Repairs',
		'Other'
	]
}

//general property types
export function getPropertyTypes() {
	return [
		"Residential",
		"Condo/Townhouse",
		"Multi-family",
		"Single-family",
	];
}

//general unit types
export function getUnitTypes() {
	return [
		"Bedsitter",
		"One Bedroom",
		"Two Bedroom",
		"Single Room",
		"Double Room",
		"Shop",
		"Other",
	];
}

export function getPropertyBaths() {
	let baths = [];
	for (let i = 1; i <= 5; i++) {
		i === 1 ? baths.push(i + " Bath") : baths.push(i + " Baths");
	}
	return baths.concat([
		"1.5 Baths",
		"2.5 Baths",
		"3.5 Baths",
		"4.5 Baths",
		"5.5 Baths",
	]);
}

export function getPropertyBeds() {
	let beds = ["Studio"];
	for (let i = 1; i <= 5; i++) {
		i === 1 ? beds.push(i + " Bed") : beds.push(i + " Beds");
	}
	return beds;
}

export const getLateFeeFrequencyOptions = () => {
	return ['One-time fee', 'Daily']
}

export function getFrequencyOptions() {
	return ["Per Day", "Week", "Month", "Quarter", "Half Year", "Year"];
}

export function getMeterTypes() {
	return ["Electric", "Sewer", "Water"];
}

export function getLeaseOptions() {
	let lease_options = [
		"Fixed",
		"Fixed w/rollover",
	];
	return lease_options;
}

export function getPaymentOptions() {
	return ["Daily", "Weekly", "Monthly", "Quarterly", "Half-Yearly", "Yearly"];
}

export function getTransactionsFilterOptions() {
	return [
		{ id: 0, text: 'Month To Date' }, { id: 'last-month', text: 'Last Month' },
		{ id: 3, text: '3 Months To Date' }, { id: 'year-to-date', text: 'Year To Date' },
		{ id: 'last-year', text: 'Last Year' },];
}

// Create our number formatter.
export const currencyFormatter = new Intl.NumberFormat(undefined, {
	style: 'decimal',
	currency: 'KES',
});
