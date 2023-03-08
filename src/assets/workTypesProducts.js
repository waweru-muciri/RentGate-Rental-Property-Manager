function getWorkTypes() {
    let workTypes = [];
    for (let index = 1; index <= 10; index++) {
        let workType = {
            id: index,
            name: "Work Type " + index,
            pay: index * 100,
        };

        workTypes.push(workType);
    }
    return workTypes;
}
let workTypes = getWorkTypes();
export default workTypes;
