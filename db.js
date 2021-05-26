const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/dealers_choice_corporation_db');
const { STRING, UUID, UUIDV4 } = Sequelize;

const Department = conn.define('department', {
    name: {
        type: STRING(50)
    }
});

const Employee = conn.define('employee', {
    id : {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name: {
        type: STRING(50)
    }
});

Department.belongsTo(Employee, {as: 'manager'}); // Department has employeeId and rename to managerId
Employee.hasMany(Department, {foreignKey: 'managerId'});

const syncAndSeed = async() => {
    await conn.sync({ force: true });
    const [moe, lucy, hr, engineering] = await Promise.all([
        Employee.create({name: 'moe'}),
        Employee.create({name: 'lucy'}),
        Department.create({name: 'hr'}),
        Department.create({name: 'engineering'})
    ]);

    hr.managerId = lucy.id;
    await hr.save();
    // console.log(JSON.stringify(hr, null, 2))
}

module.exports = {
    syncAndSeed,
    conn,
    models: {
        Department,
        Employee
    }
}