import React from 'react';
import { Input } from "semantic-ui-react";

const ConfigurationField = props => {
    const {onClick, onChange, label, buttonTitle, placeholder, defaultValue, minWidth, type} = props;
    return (
        <Input action={{onClick, content: buttonTitle || 'Enviar', color: 'blue'}}
               size={'big'}
               type={type || 'text'}
               onChange={onChange}
               style={{minWidth: minWidth || 750}}
               labelPosition={'left'}
               label={{basic: true, content: label}}
               placeholder={placeholder}
               defaultValue={defaultValue}
        />
    );
};

export default ConfigurationField;
