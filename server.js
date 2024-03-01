const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

// Oracle DB Connection Config
const dbConfig = {
  user: 'system',
  password: 'manager',
  connectString: 'localhost:/XEXDB',
};

// Sample routes
app.get('/api/data', async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute('SELECT * FROM pf');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/pf_insert', async (req, res) => {
  const { wef_date, pf_per, epf_per, fpf_per, catg } = req.body;

  console.log('Received Data:', { wef_date, pf_per, epf_per, fpf_per, catg });

  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`INSERT INTO pf VALUES (TO_DATE('${wef_date}', 'YYYY-MM-DD'),'${pf_per}','${epf_per}','${fpf_per}','${catg}')`);
    await connection.commit();
    console.log('Data inserted successfully');
    res.send('Data inserted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/employee_insert', async (req, res) => {
  const {emp_code,emp_name, emp_qual, emp_join_date,emp_resignation_date,emp_pan_no,emp_aadhar_no,emp_pf_flag,emp_pf_no,emp_esi_no,emp_est_flag,emp_gst_no,emp_basic,emp_dept,emp_hno,emp_street,emp_city,emp_pincode,emp_state,emp_ph_no,emp_email_id,emp_cons_res_flag,emp_spl_pay,emp_bank_ifsc,emp_bank_name,emp_bank_account_no } = req.body;

  console.log('Received Data:', { emp_code,emp_name, emp_qual, emp_join_date,emp_resignation_date,emp_pan_no,emp_aadhar_no,emp_pf_flag,emp_pf_no,emp_esi_no,emp_est_flag,emp_gst_no,emp_basic,emp_dept,emp_hno,emp_street,emp_city,emp_pincode,emp_state,emp_ph_no,emp_email_id,emp_cons_res_flag,emp_spl_pay,emp_bank_ifsc,emp_bank_name,emp_bank_account_no });

  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`INSERT INTO emp VALUES ('${emp_code}','${emp_name}','${emp_qual}',TO_DATE('${emp_join_date}', 'YYYY-MM-DD'),TO_DATE('${emp_resignation_date}', 'YYYY-MM-DD'),'${emp_pan_no}',${emp_aadhar_no},'${emp_pf_flag}','${emp_pf_no}',${emp_esi_no},'${emp_est_flag}','${emp_gst_no}',${emp_basic},'${emp_dept}','${emp_hno}','${emp_street}','${emp_city}',${emp_pincode},'${emp_state}',${emp_ph_no},'${emp_email_id}','${emp_cons_res_flag}',${emp_spl_pay},'${emp_bank_ifsc}','${emp_bank_name}','${emp_bank_account_no}')`);
    await connection.commit();
    console.log('Data inserted successfully');
    res.send('Data inserted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});  

app.put('/employee_update/:code', async (req, res) => {
  const { code } = req.params;

  try {
    const {
      emp_name,emp_qual,emp_join_date,emp_resignation_date,emp_pan_no,emp_aadhar_no,emp_pf_flag,emp_pf_no,emp_esi_no,emp_est_flag,emp_gst_no,
      emp_basic,emp_dept,emp_hno,emp_street,emp_city,emp_pincode,emp_state,emp_ph_no,emp_email_id,emp_cons_res_flag,emp_spl_pay,emp_bank_ifsc,
      emp_bank_name,emp_bank_account_no
    } = req.body;

    console.log("Received data", {
      emp_name,emp_qual,emp_join_date,emp_resignation_date,emp_pan_no,emp_aadhar_no,emp_pf_flag,emp_pf_no,emp_esi_no,emp_est_flag,emp_gst_no,
      emp_basic,emp_dept,emp_hno,emp_street,emp_city,emp_pincode,emp_state,emp_ph_no,emp_email_id,emp_cons_res_flag,emp_spl_pay,emp_bank_ifsc,
      emp_bank_name,emp_bank_account_no
    });

    // Ensure dates are in the correct format
    const formattedJoinDate = new Date(emp_join_date).toISOString().slice(0, 10);
    const formattedResignationDate = new Date(emp_resignation_date).toISOString().slice(0, 10);

    const connection = await oracledb.getConnection(dbConfig);

    await connection.execute(`
      UPDATE emp 
      SET emp_name = :emp_name, emp_qual = :emp_qual, emp_join_date = TO_DATE(:emp_join_date, 'YYYY-MM-DD'), emp_resignation_date = TO_DATE(:emp_resignation_date, 'YYYY-MM-DD'), emp_pan_no = :emp_pan_no, emp_aadhar_no = :emp_aadhar_no, emp_pf_flag = :emp_pf_flag, emp_pf_no = :emp_pf_no, emp_esi_no = :emp_esi_no, 
          emp_est_flag = :emp_est_flag, emp_gst_no = :emp_gst_no, emp_basic = :emp_basic, emp_dept = :emp_dept, emp_hno = :emp_hno, emp_street = :emp_street, emp_city = :emp_city, emp_pincode = :emp_pincode, 
          emp_state = :emp_state, emp_ph_no = :emp_ph_no, emp_email_id = :emp_email_id, emp_cons_res_flag = :emp_cons_res_flag, emp_spl_pay = :emp_spl_pay, emp_bank_ifsc = :emp_bank_ifsc, emp_bank_name = :emp_bank_name, 
          emp_bank_account_no = :emp_bank_account_no
      WHERE emp_code = :code`, {
          emp_name,emp_qual,emp_join_date: formattedJoinDate, emp_resignation_date: formattedResignationDate, emp_pan_no, emp_aadhar_no, emp_pf_flag, emp_pf_no, emp_esi_no, 
          emp_est_flag, emp_gst_no, emp_basic, emp_dept, emp_hno, emp_street, emp_city, emp_pincode, emp_state, emp_ph_no, emp_email_id, emp_cons_res_flag, emp_spl_pay, emp_bank_ifsc,
          emp_bank_name, emp_bank_account_no, code
      }
    );

    await connection.commit();
    console.log('Data updated successfully');
    res.send('Data updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  } 
});

app.post('/da_insert', async (req, res) => {
  const { wef_date,catg,da_per} = req.body;

  console.log('Received Data:', {wef_date, catg,da_per });

  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`INSERT INTO da VALUES (TO_DATE('${wef_date}', 'YYYY-MM-DD'), '${catg}','${da_per}')`);
    await connection.commit();
    console.log('Data inserted successfully');
    res.send('Data inserted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/hra_insert', async (req, res) => {
  const { wef_date,catg,hra_per} = req.body;
  console.log('Received Data:',{ wef_date, catg,hra_per });
  try {
    const connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`INSERT INTO hra VALUES (TO_DATE('${wef_date}', 'YYYY-MM-DD'), '${catg}',${hra_per})`);
    await connection.commit();
    console.log('Data inserted successfully');
    res.send('Data inserted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/trial',async(req,res)=>
{

});

app.get('/api/employee/:e_sal_emp_code', async (req, res) => {
  const employeeCode = req.params.e_sal_emp_code;

  console.log(employeeCode);
  let connection;

  try {
      connection = await oracledb.getConnection(dbConfig);

      const result = await connection.execute(
        `SELECT * FROM salary WHERE e_sal_emp_code =  '${employeeCode}'`
          // `SELECT * FROM salary WHERE e_sal_emp_code = '21471A05D5'`,
          // { code: employeeCode }
      );

      const employeeDetails = result.rows[0];
      console.log(employeeDetails);
      res.json(employeeDetails);
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  } finally {
      if (connection) {
          try {
              await connection.close();
          } catch (error) {
              console.error(error.message);
          }
      }
  }
});
// app.get('/admin', async (req, res) => {
//   const employeeCode = req.params.name;

//   console.log(employeeCode);
//   let connection;

//   try {
//       connection = await oracledb.getConnection(dbConfig);

//       const result = await connection.execute(
//         `SELECT * FROM admin WHERE name =  '${employeeCode}'`
//           // `SELECT * FROM salary WHERE e_sal_emp_code = '21471A05D5'`,
//           // { code: employeeCode }
//       );

//       const employeeDetails = result.rows[0];
//       console.log(employeeDetails);
//       res.json(employeeDetails);
//   } catch (error) {
//       console.error(error.message);
//       res.status(500).json({ error: 'Internal Server Error' });
//   } finally {
//       if (connection) {
//           try {
//               await connection.close();
//           } catch (error) {
//               console.error(error.message);
//           }
//       }
//   }
// });

app.get("/all_salary_details_Read", async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`select * from salary`);
    const data = result.rows; // Assuming the result contains an array of rows
    console.log('Data Retrieved successfully');
    res.json(data); // Send the data as JSON to the client
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
app.get("/all_employee_details_Read", async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`select * from emp`);
    const data = result.rows; // Assuming the result contains an array of rows
    console.log('Data Retrieved successfully');
    res.json(data); // Send the data as JSON to the client
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.get("/employee_detail_Read:_id", async (req, res) => {
  try {
    const emp_code = req.params._id;
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`select * from emp where emp_code='${emp_code}'`);
    const data = result.rows; // Assuming the result contains an array of rows
    console.log('Data Retrieved successfully');
    res.json(data); // Send the data as JSON to the client
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete("/delete_employee/:_id", async (req, res) => {
  try {
    const emp_code = req.params._id;
    console.log(emp_code);
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`delete from emp where emp_code = '${emp_code}'`);
    console.log(result);
    console.log('Data Deleted successfully');
    connection.commit()
    connection.close()
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(PORT, () => {
console.log(`Server is running on port  http://localhost:${PORT}`);
});



// Similar routes for update and delete operations

