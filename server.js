const express = require("express")
const path = require('path');
const User = require('./models/User')
const Employee = require("./models/Employee")
const bcrypt = require("bcrypt");
const cors = require("cors");

// const hostname = 'https://comp3123-assignment1.vercel.app';
// const port =4000;

const app = express()
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: "http://localhost:3000" })); // Allow requests from this origin
app.use(express.json());


// app.listen(port, () => {
//     console.log(`API listening on PORT ${port} `)
//
// });


app.get('/', (req, res) => {
    res.send('Hey this is my API running 🥳')
})
app.get('/favicon.ico', (req, res) => res.status(204));
app.get('/about', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.send('yayy')

    return res.status(200).json({message: 'Email username must be unique AND all 3 fields required'});
})

//User management
app.post("/api/v1/user/signup", async (req, res) => {
    const {username, email, password} = req.body
    if (!(username && email && password)) {
        //Checks if all 3 fields are filled
        return res.status(400).json({message: 'Email username must be unique AND all 3 fields required'});

    }
    try {
        if (await User.findOne({email})) {
            return res.status(409).json({message: 'User with this email already exists.'});
        } else {
            const newUser = new User({username, email, password})
            await newUser.save();
            return res.status(201).json({message: 'User created successfully!'});
        }
    } catch (err) {
        console.error(err)
        return res.status(500).json({message: "Error creating user"})
    }
})
app.post('/api/v1/user/login', async (req, res) => {
    const {email, password} = req.body
    if (!(email && password)) {
        //Checks if all 3 fields are filled
        return res.status(400).json({message: 'all fields required'});
    }
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({message: 'Invalid email or password.'});
        }
        if (!(await bcrypt.compare(password, user.password))) {
            //match password with database pass
            return res.status(401).json({message: 'Invalid email or password.'});
        }
        // If login is successful
        return res.status(200).json({message: 'Login successful!'});

    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({message: 'Internal server error.'});
    }
})


//Employee management

app.get("/api/v1/emp/employees", async (req, res) => {
    let employees = await Employee.find()
    return res.status(200).json(employees)
})
app.post("/api/v1/emp/employees", async (req, res) => {
    const {first_name, last_name, email, position, salary, date_of_joining, department} = req.body
    if (!first_name || !last_name || !email || !position || !salary) {
        return res.status(400).json({message: 'all fields required'});
    }
    try{
        if(await Employee.findOne({email})){
            return res.status(409).json({message: 'employee with this email already exists.'});
        }else{
            const newEmp = new Employee({first_name, last_name, email, position, salary, date_of_joining, department})
            await newEmp.save()
            return res.status(201).json(newEmp)
        }
    }catch (e){
        console.error(e)
        return res.status(500).json({ message: 'Internal server error' });

    }


})
app.get('/api/v1/emp/employees/:eid', async (req, res) => {
    try {
        const { eid } = req.params;
        const employee = await Employee.findById(eid);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Send employee data
        return res.status(200).json(employee);
    } catch (error) {
        console.error('Error fetching employee:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
app.put('/api/v1/emp/employees/:eid', async (req, res) => {
    try {
        const { eid } = req.params;  // Extract employee ID from the URL
        const { name, position, department, salary } = req.body;

        // Find the employee by ID and update
        const updatedEmployee = await Employee.findByIdAndUpdate(
            eid,
            { name, position, department, salary },
            { new: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Send updated employee data
        return res.status(200).json({
            message: 'Employee updated successfully',
            employee: updatedEmployee
        });
    } catch (error) {
        console.error('Error updating employee:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
app.delete('/api/v1/emp/employees', async (req, res) => {
    try {
        const { eid } = req.query;

        // Find employee by ID and delete
        const deletedEmployee = await Employee.findByIdAndDelete(eid);

        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }


        return res.status(204).json({message:"employee deleted successfully"});
    } catch (error) {
        console.error('Error deleting employee:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
// app.use('/route')
module.exports = app
