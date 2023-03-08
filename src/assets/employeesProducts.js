function getEmployees() {
    let employees = []
    for (let index = 1; index <= 10; index++) {
        let employee = {
            id: index,
            first_name: "firstName " + index,
            last_name: "lastName " + index,
        }

        employees.push(employee)
    }
    return employees;
}

let employees = getEmployees()
export default employees