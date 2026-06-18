import pandas as pd
import sqlite3
from sklearn.model_selection import train_test_split
import joblib
from sklearn.preprocessing import StandardScaler

def load_data(path:str):
    connection=sqlite3.connect(path)
    query= """
    with purchase_agg As(
    select 
    p.PONumber,
    count(distinct p.Brand) as total_brands,
    sum(p.Quantity) as total_quantity,
    sum(p.Dollars) as total_freight,
    avg(julianday(p.ReceivingDate)- julianday(p.PODate)) as avg_time
    from purchases p
    group by p.PONumber)

    select
    vi.PONumber,
    vi.Quantity	as invoice_quantity,
    vi.Dollars as invoice_price,
    vi.Freight,
    julianday(vi.InvoiceDate)- julianday(vi.PODate) as days_po_to_invoice,
    julianday(vi.PayDate)- julianday(vi.InvoiceDate) as days_po_to_pay,
    pa.total_brands,
    pa.total_quantity,
    pa.total_freight,
    pa.avg_time

    from vendor_invoice as vi
    LEFT JOIN purchase_agg as pa
    ON vi.PONumber=pa.PONumber       
    """
    df=pd.read_sql_query(query,connection)
    connection.close()
    df = df.fillna(0)
    df = feature_engineering(df)
    return df


def invoice_fragging_label(row):
    price_diff_ratio = abs(row["invoice_price"] - row["total_freight"]) / (row["invoice_price"] + 1)

    if price_diff_ratio > 0.15:
        return 1

    if row["avg_time"] > 10:
        return 1

    return 0 

def feature_engineering(df: pd.DataFrame):
    
    df["price_per_unit"] = df["invoice_price"] / (df["invoice_quantity"] + 1)
    
    df["freight_ratio"] = df["Freight"] / (df["invoice_price"] + 1)
    
    df["quantity_ratio"] = df["invoice_quantity"] / (df["total_quantity"] + 1)
    
    df["delay_ratio"] = df["days_po_to_invoice"] / (df["avg_time"] + 1)

    return df
def apply_fragging_label(df):
    df["flag_invoice"]=df.apply(invoice_fragging_label,axis=1)
    return df

def split_data(df,features,target):
    X=df[features]
    Y=df[target]
    return train_test_split(X, Y, test_size=0.2, random_state=42)

def features_scalling(x_train,x_test,path):
    scaler=StandardScaler()
    x_train_scaled=scaler.fit_transform(x_train)
    x_test_scaled=scaler.transform(x_test)
    
    joblib.dump(scaler,path)
    return x_train_scaled,x_test_scaled


def explain_flag(row):
    reasons = []

    if abs(row["invoice_price"] - row["total_freight"]) / (row["invoice_price"] + 1) > 0.15:
        reasons.append("Price mismatch with total freight")

    if row["avg_time"] > 10:
        reasons.append("Unusual delivery delay")

    if row["Freight"] / (row["invoice_price"] + 1) > 0.3:
        reasons.append("Freight too high relative to price")

    return ", ".join(reasons)