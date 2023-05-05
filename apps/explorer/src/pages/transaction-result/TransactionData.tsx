// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { formatDate, useTransactionSummary } from '@mysten/core';
import {
    getTransactionKind,
    getTransactionKindName,
    type ProgrammableTransaction,
    type SuiTransactionBlockResponse,
} from '@mysten/sui.js';

import { GasBreakdown } from '~/components/GasBreakdown';
import { InputsCard } from '~/pages/transaction-result/programmable-transaction-view/InputsCard';
import { TransactionsCard } from '~/pages/transaction-result/programmable-transaction-view/TransactionsCard';
import { Heading } from '~/ui/Heading';
import {
    AddressLink,
    CheckpointSequenceLink,
    EpochLink,
} from '~/ui/InternalLink';
import { Text } from '~/ui/Text';
import {
    TransactionBlockCard,
    TransactionBlockCardSection,
} from '~/ui/TransactionBlockCard';

interface Props {
    transaction: SuiTransactionBlockResponse;
}

export function TransactionData({ transaction }: Props) {
    const summary = useTransactionSummary({
        transaction,
    });

    const transactionKindName = getTransactionKindName(
        getTransactionKind(transaction)!
    );

    const isProgrammableTransaction =
        transactionKindName === 'ProgrammableTransaction';

    const programmableTxn = transaction.transaction!.data
        .transaction as ProgrammableTransaction;

    return (
        <div className="flex flex-wrap gap-6">
            <section className="flex w-96 min-w-[50%] flex-1 flex-col gap-6">
                {transaction.checkpoint && (
                    <TransactionBlockCard>
                        <TransactionBlockCardSection>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-2">
                                    {summary?.sender && (
                                        <>
                                            <Text
                                                variant="pBody/semibold"
                                                color="steel-darker"
                                            >
                                                Sender
                                            </Text>
                                            <AddressLink
                                                address={summary?.sender}
                                            />
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <Text
                                        variant="pBody/semibold"
                                        color="steel-darker"
                                    >
                                        Checkpoint
                                    </Text>
                                    <CheckpointSequenceLink
                                        noTruncate
                                        label={Number(
                                            transaction.checkpoint
                                        ).toLocaleString()}
                                        sequence={transaction.checkpoint}
                                    />
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    {transaction.effects?.executedEpoch && (
                                        <>
                                            <Text
                                                variant="pBody/semibold"
                                                color="steel-darker"
                                            >
                                                Executed Epoch
                                            </Text>
                                            <EpochLink
                                                epoch={
                                                    transaction.effects
                                                        ?.executedEpoch
                                                }
                                            />
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    {summary?.timestamp && (
                                        <>
                                            <Text
                                                variant="pBody/semibold"
                                                color="steel-darker"
                                            >
                                                Timestamp
                                            </Text>
                                            <Text
                                                variant="pBody/normal"
                                                color="steel-dark"
                                            >
                                                {`${new Intl.DateTimeFormat(
                                                    'en-US',
                                                    {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        second: '2-digit',
                                                        fractionalSecondDigits: 3,
                                                    }
                                                ).format(
                                                    new Date(
                                                        Number(
                                                            summary?.timestamp
                                                        ) ?? 0
                                                    )
                                                )}`}
                                            </Text>
                                        </>
                                    )}
                                </div>
                            </div>
                        </TransactionBlockCardSection>
                    </TransactionBlockCard>
                )}

                {isProgrammableTransaction && (
                    <InputsCard inputs={programmableTxn.inputs} />
                )}
            </section>

            <section className="flex w-96 flex-1 flex-col gap-6">
                {isProgrammableTransaction && (
                    <>
                        <TransactionsCard
                            transactions={programmableTxn.transactions}
                        />
                        <section data-testid="gas-breakdown">
                            <GasBreakdown summary={summary} />
                        </section>
                    </>
                )}
            </section>
        </div>
    );
}
