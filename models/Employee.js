const mongoose = require('mongoose').default;
// const mongoUri = process.env.MONGODB_URI;
const mongoUri="mongodb+srv://vercel-admin-user:comp3123@comp3123.evhc4.mongodb.net/?retryWrites=true&w=majority&appName=comp3123"
mongoose.set('strictQuery', false);
    mongoose.connect(mongoUri)
        .then(() => console.log('MongoDB employees connected'))
        .catch(err => console.error('MongoDB employee connection error:', err));

//Schemas
const EmployeeSchema = new mongoose.Schema({
    first_name: {type: String, unique: false, required: true},
    last_name: {type: String, unique: false, required: true},
    email: {
        type: String, required: true, unique: true, trim: true,
        validate: {
            validator: (v) => {
                return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    position: {type: String, required: true, trim: true},
    salary: {type: Number, required: true,},
    date_of_joining: {type: Date, required: true, default: Date.now()},
    department: {type: String, default: "Developer"},
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {type: Date, default: Date.now},

});

const Employee = mongoose.model('Employees', EmployeeSchema);

module.exports = Employee;