from model_evaluation import evaluate_model,random_forest_train
from preprocessing import load_data, split_data, apply_fragging_label, invoice_fragging_label, features_scalling
import joblib


features = [
    "invoice_quantity",
    "invoice_price",
    "Freight",
    "total_quantity",
    "total_freight",
    "price_per_unit",
    "freight_ratio",
    "quantity_ratio",
    "delay_ratio"
]

target="flag_invoice"

def main():
    df = load_data("data/inventory.db")
    df=apply_fragging_label(df)

    x_train,x_test,y_train,y_test=split_data(df,features,target)
    x_train_scaled,x_test_scaled=features_scalling(x_train,x_test,'models/invoice_scaler.pkl')

    grid_search=random_forest_train(x_train_scaled,y_train)
    evaluate_model(grid_search.best_estimator_,
                   x_test_scaled,y_test,"Random Forest Classifier"
                   )
    
    joblib.dump(grid_search.best_estimator_,'models/invoice_model.pkl')

if __name__=="__main__":
    main()    