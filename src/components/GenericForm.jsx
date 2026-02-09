import PropTypes from "prop-types";
import InputField from "./InputField";

const shouldShowField = (showWhen) => {
    if (typeof showWhen === "function") {
        return Boolean(showWhen());
    }

    if (showWhen === undefined) {
        return true;
    }

    return Boolean(showWhen);
};

const GenericForm = ({ fields }) => {
    return (
        <>
            {fields
                .filter((field) => shouldShowField(field.showWhen))
                .map((field) => {
                    const wrapperClassName =
                        field.wrapperClassName || "form-group";

                    if (field.type === "select") {
                        return (
                            <div className={wrapperClassName} key={field.id}>
                                {field.label && (
                                    <label htmlFor={field.id}>
                                        {field.label}
                                    </label>
                                )}
                                <select
                                    id={field.id}
                                    value={field.value}
                                    onChange={field.onChange}
                                >
                                    {field.options.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        );
                    }

                    if (field.type === "radio") {
                        return (
                            <div className={wrapperClassName} key={field.id}>
                                {field.label && (
                                    <span className={field.labelClassName}>
                                        {field.label}
                                    </span>
                                )}
                                {field.options.map((option) => (
                                    <label
                                        key={option.value}
                                        className={option.labelClassName}
                                    >
                                        <input
                                            type="radio"
                                            name={field.name || field.id}
                                            value={option.value}
                                            checked={
                                                String(field.value) ===
                                                String(option.value)
                                            }
                                            onChange={() =>
                                                field.onChange(option.value)
                                            }
                                        />
                                        {option.label}
                                    </label>
                                ))}
                            </div>
                        );
                    }

                    return (
                        <InputField
                            key={field.id}
                            id={field.id}
                            label={field.label}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={field.placeholder}
                            type={field.type || "number"}
                        />
                    );
                })}
        </>
    );
};

GenericForm.propTypes = {
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            onChange: PropTypes.func.isRequired,
            placeholder: PropTypes.string,
            type: PropTypes.string,
            options: PropTypes.arrayOf(
                PropTypes.shape({
                    value: PropTypes.oneOfType([
                        PropTypes.string,
                        PropTypes.number,
                    ]).isRequired,
                    label: PropTypes.string.isRequired,
                    labelClassName: PropTypes.string,
                })
            ),
            showWhen: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
            wrapperClassName: PropTypes.string,
            labelClassName: PropTypes.string,
            name: PropTypes.string,
        })
    ).isRequired,
};

export default GenericForm;
