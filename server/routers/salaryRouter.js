import { Router } from "express";
import Salary from '../model/salaryModel.js';

const salaryRouter = Router();

salaryRouter.route('*')
  .all((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Content-Type", "application/json");
    next();
  })

salaryRouter.route('/:id')
  .get(async (req, res) => {
    const id = req.params['id'];
    console.log(id);

    try {
      const emp = await Salary.findOne({ code: id }).exec();

      if (emp === null) res.status(200).json({ msg: "NULL" });
      else res.status(200).json(emp);
    } catch {
      res.status(400);
    }

  })

  .post(async (req, res) => {
    const id = req.params['id'];

    const oldEmp = await Salary.findOne({ code: id }).exec();
    console.log(oldEmp);

    try {
      if (oldEmp === null) {
        const emp = new Salary({ code: id });
        emp.month = req?.body?.month;
        emp.year = req?.body?.year;
        emp.name = req?.body?.name;
        emp.designation = req?.body?.designation;
        emp.department = req?.body?.department;
        emp.location = req?.body?.location;
        emp.PFAccount = req?.body?.PFAccount;
        emp.UAN = req?.body?.UAN;
        emp.PAN = req?.body?.PAN;
        emp.bank = req?.body?.bank;
        emp.ESI = req?.body?.ESI;
        emp.basic = req?.body?.basic;
        emp.specialAllowance = req?.body?.specialAllowance;
        emp.providentFund = req?.body?.providentFund;
        emp.insurance = req?.body?.insurance;
        emp.reimburse = req?.body?.reimburse;

        await emp.save();
        res.status(200).json(emp)
        return;

      } else {
        //update the old emp
        oldEmp.month = req?.body?.month;
        oldEmp.year = req?.body?.year;
        oldEmp.name = req?.body?.name;
        oldEmp.designation = req?.body?.designation;
        oldEmp.department = req?.body?.department;
        oldEmp.location = req?.body?.location;
        oldEmp.PFAccount = req?.body?.PFAccount;
        oldEmp.UAN = req?.body?.UAN;
        oldEmp.PAN = req?.body?.PAN;
        oldEmp.bank = req?.body?.bank;
        oldEmp.ESI = req?.body?.ESI;
        oldEmp.basic = req?.body?.basic;
        oldEmp.specialAllowance = req?.body?.specialAllowance;
        oldEmp.providentFund = req?.body?.providentFund;
        oldEmp.insurance = req?.body?.insurance;
        oldEmp.reimburse = req?.body?.reimburse;

        await oldEmp.save();
        res.status(200).json(oldEmp);
        return;
      }
    }
    catch {
      res.status(400);
    }

  })


export default salaryRouter;
