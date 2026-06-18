import pandas as pd
import joblib
import sqlite3
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

def data_loading(path: str):
    connnection=sqlite3.connect(path)
    query='''WITH purchase_agg AS (
                    SELECT 
                        p.PONumber,
                        SUM(p.Quantity) AS total_quantity,
                        COUNT(DISTINCT p.Brand) AS total_brands,
                        AVG(julianday(p.ReceivingDate) - julianday(p.PODate)) AS avg_delivery_time
                    FROM purchases p
                    GROUP BY p.PONumber
                    )

                SELECT
                vi.PONumber,
            
            
            vi.Quantity AS invoice_quantity,
            vi.Dollars AS invoice_price,
            vi.Freight,

            
            (vi.Dollars * 1.0 / (vi.Quantity + 1)) AS price_per_unit,

            (julianday(vi.InvoiceDate) - julianday(vi.PODate)) AS invoice_delay,

            pa.total_quantity,
            pa.total_brands,
            pa.avg_delivery_time

        FROM vendor_invoice vi

        LEFT JOIN purchase_agg pa
        ON vi.PONumber = pa.PONumber'''
    df=pd.read_sql_query(query,connnection)
    connnection.close()
    df = df.dropna()
    return df

def feature_preparation(df: pd.DataFrame):
    X=df[["invoice_price",
            "invoice_quantity",
            "price_per_unit",
            "invoice_delay",
            "total_quantity"]]
    Y=df['Freight']

    return X,Y

def train_test_splitting(X,Y, test_size=0.2, random_state=42):
    return train_test_split(X, Y, test_size=test_size, random_state=random_state)
    

def features_scalling(x_train,x_test):
    scaler=StandardScaler()
    x_train_scaled=scaler.fit_transform(x_train)
    x_test_scaled=scaler.transform(x_test)
    
    joblib.dump(scaler, "models/freight_scaler.pkl")
    return x_train_scaled,x_test_scaled    