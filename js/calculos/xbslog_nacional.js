function calcular_xbslog_nacional(destino, dimensoes, conversion) {
    let totalCubicMeters = 0;
    let totalLdm = 0;
    let hasBox = false;
    let hasPallet = false;
    let allPalletsHaveLowHeight = true;
    let allPalletsHaveHighHeight = true;
    let allLengthsValid = true;

    dimensoes.forEach(d => {
        const { type, width, length, height, quantity } = d;
        if (type === "box") {
            hasBox = true;
        } else if (type === "pallet") {
            hasPallet = true;
            if (height > 125) {
                allPalletsHaveLowHeight = false;
                if (length < 100 || length > 125) allLengthsValid = false;
            } else {
                allPalletsHaveHighHeight = false;
            }
        }
    });

    let totalWeight, scaledWeight, rates, rateTier, cost, rateValue, rateLabel;

    if (hasPallet && !hasBox && allPalletsHaveHighHeight && allLengthsValid) {
        dimensoes.forEach(d => {
            const { type, width, length, quantity } = d;
            if (type === "pallet") {
                let adjustedLength = (length >= 100 && length <= 125) ? 120 : length; // Correção aplicada
                totalLdm += (width / 240) * (adjustedLength / 100) * quantity;
            }
        });
        if (totalLdm === 0) {
            return { erro: "Não é possível calcular: Nenhuma dimensão LDM válida." };
        }
        totalWeight = totalLdm * (conversion?.LDM || 333);
    } else {
        dimensoes.forEach(d => {
            const { type, width, length, height, quantity } = d;
            let adjustedHeight = height > 125 ? 250 : height; // Correção aplicada

            let adjustedLength = length; // Definição corrigida
            let cubicMeters = (width * adjustedLength * adjustedHeight) / 1000000;
            totalCubicMeters += cubicMeters * quantity;
        });

        if (totalCubicMeters === 0) {
            return { erro: "Por favor preencha as dimensões." };
        }

        totalWeight = totalCubicMeters * (conversion?.m3 || 333);
    }

    // Tarifário nacional
    rates = destino?.rates;
    if (!rates) {
        return { erro: "Não existem tarifas para este destino nacional." };
    }

    // Faixas tarifárias
    if (totalWeight <= 50) {
        scaledWeight = 1;
        rateValue = rates["1-50"];
        cost = rates["1-50"];
        rateLabel = "1-50";
    } else if (totalWeight <= 100) {
        scaledWeight = 1;
        rateValue = rates["51-100"];
        cost = rates["51-100"];
        rateLabel = "51-100";
    } else if (totalWeight <= 200) {
        scaledWeight = Math.ceil(totalWeight / 100);
        rateValue = rates["101-200"];
        cost = scaledWeight * rates["101-200"];
        rateLabel = "101-200";
    } else if (totalWeight <= 300) {
        scaledWeight = Math.ceil(totalWeight / 100);
        rateValue = rates["201-300"];
        cost = scaledWeight * rates["201-300"];
        rateLabel = "201-300";
    } else if (totalWeight <= 500) {
        scaledWeight = Math.ceil(totalWeight / 100);
        rateValue = rates["301-500"];
        cost = scaledWeight * rates["301-500"];
        rateLabel = "301-500";
    } else if (totalWeight <= 750) {
        scaledWeight = totalWeight <= 700 ? Math.ceil(totalWeight / 100) : 7;
        rateValue = rates["501-750"];
        cost = scaledWeight * rates["501-750"];
        rateLabel = "501-750";
    } else if (totalWeight <= 1000) {
        scaledWeight = totalWeight <= 800 ? 8 : Math.ceil(totalWeight / 100);
        rateValue = rates["751-1000"];
        cost = scaledWeight * rates["751-1000"];
        rateLabel = "751-1000";
    } else if (totalWeight <= 2000) {
        scaledWeight = Math.ceil(totalWeight / 100);
        rateValue = rates["1001-2000"];
        cost = scaledWeight * rates["1001-2000"];
        rateLabel = "1001-2000";
    } else if (totalWeight <= 3500) {
        scaledWeight = Math.ceil(totalWeight / 100);
        rateValue = rates["2001-3500"];
        cost = scaledWeight * rates["2001-3500"];
        rateLabel = "2001-3500";
    } else if (totalWeight <= 5000) {
        scaledWeight = Math.ceil(totalWeight / 100);
        rateValue = rates["3501-5000"];
        cost = scaledWeight * rates["3501-5000"];
        rateLabel = "3501-5000";
    } else {
        scaledWeight = Math.ceil(totalWeight / 100);
        rateValue = rates[">5000"];
        cost = scaledWeight * rates[">5000"];
        rateLabel = ">5000";
    }
    cost = cost < rates.minimum ? rates.minimum : cost;

    return {
        transportadora: "XBS Nacional",
        totalLdm,
        totalCubicMeters,
        totalWeight,
        scaledWeight,
        rateValue,
        rateLabel,
        cost,
        erro: null
    };
}
