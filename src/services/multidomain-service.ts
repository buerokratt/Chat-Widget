import {isMultiDomainEnabled, multiDomainWidgetDomain} from "../constants";
import {WIDGET_DOMAIN_OVERRIDE} from "../utils/widget-instance-utils";

const getDomain = (): string => {
    return WIDGET_DOMAIN_OVERRIDE || multiDomainWidgetDomain || window.location.toString();
}

export const getMultiDomainUrl = (): string => {
    return '?domain=' + (isMultiDomainEnabled ? getDomain() : 'none');
}

export const getMultiDomainPath = (): string => {
    return (isMultiDomainEnabled ? getDomain() : 'none').toString();
}