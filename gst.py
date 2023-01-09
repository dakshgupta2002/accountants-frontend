import pandas as pd
import csv   

df = pd.read_csv('gst.csv', dtype=str)

grouped = {}

for index in df.iterrows():
    data = index[1]
    if data.hsn in grouped:
        if data.uqc in grouped[data.hsn]:
            if data.rate in grouped[data.hsn][data.uqc]:
                grouped[data.hsn][data.uqc][data.rate]["taxable_value"] += (float(data.taxable_value))
                grouped[data.hsn][data.uqc][data.rate]["integrated_tax_amount"] += (float(data.integrated_tax_amount))
                grouped[data.hsn][data.uqc][data.rate]["central_tax_amount"] += (float(data.central_tax_amount))
                grouped[data.hsn][data.uqc][data.rate]["state_tax_amount"] += (float(data.state_tax_amount))
                grouped[data.hsn][data.uqc][data.rate]["quantity"] += (float(data.quantity))
            else:
                grouped[data.hsn][data.uqc][data.rate] = {
                    "taxable_value": (float(data.taxable_value)),
                    "integrated_tax_amount": (float(data.integrated_tax_amount)),
                    "central_tax_amount": (float(data.central_tax_amount)),
                    "state_tax_amount": (float(data.state_tax_amount)),
                    "quantity": (float(data.quantity))
                }
        else:
            grouped[data.hsn][data.uqc] = {data.rate:{
                "taxable_value": (float(data.taxable_value)),
                "integrated_tax_amount": (float(data.integrated_tax_amount)),
                "central_tax_amount": (float(data.central_tax_amount)),
                "state_tax_amount": (float(data.state_tax_amount)),
                "quantity": (float(data.quantity))

            }}
    else:
        grouped[data.hsn] = {data.uqc: {
            data.rate: {
                "taxable_value": (float(data.taxable_value)),
                "integrated_tax_amount": (float(data.integrated_tax_amount)),
                "central_tax_amount": (float(data.central_tax_amount)),
                "state_tax_amount": (float(data.state_tax_amount)),
                "quantity": (float(data.quantity))

        }}}                
    
with open ('res.csv', 'w', newline='') as res:
    csv_writer = csv.writer(res)
    csv_writer.writerow(['HSN', 'UQC', 'RATE', 'QUANTITY', 'TAXABLE_VALUE', 'IGST', 'CGST', 'SGST', 'CESS'])

    for hsn in grouped:
        for uqc in grouped[hsn]:
            for rate in grouped[hsn][uqc]:
                
                value = grouped[hsn][uqc][rate]["taxable_value"]
                quantity = grouped[hsn][uqc][rate]["quantity"]
                igst = grouped[hsn][uqc][rate]["integrated_tax_amount"] 
                cgst = grouped[hsn][uqc][rate]["central_tax_amount"]
                sgst = grouped[hsn][uqc][rate]["state_tax_amount"]
                
                cess = 0
                if (float(rate) == 28): cess = value*0.12

                csv_writer.writerow([hsn, uqc, rate, quantity, value, igst, cgst, sgst, cess])