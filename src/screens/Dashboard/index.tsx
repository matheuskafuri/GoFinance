import React, { useEffect, useState } from 'react';
import {ActivityIndicator} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';


import { Container, 
  Header,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  UserWrapper,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer
} from './styles';
import { useCallback } from 'react';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  total: string;
  lastTransaction: string;
}
interface HighlightData {
  entries: HighlightProps;
  expenses: HighlightProps;
  balance: HighlightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

  const theme = useTheme();

  function getLastTransactionDate(
    collection: DataListProps[], 
    type: 'positive' | 'negative'
  ){
    const lastTransaction = new Date (
    Math.max.apply(Math, collection
    .filter(transaction => transaction.type === type )
    .map(transaction => new Date(transaction.date).getTime())))
    
    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`;

  }
  async function loadTransactions(){
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensesTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions
    .map((item: DataListProps) => {

      if(item.type === 'positive') {
        entriesTotal += Number(item.amount);
      }else {
        expensesTotal += Number(item.amount);
      }

      const amount = Number(item.amount)
      .toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

      // console.log(item);

      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(new Date(item.date));

      // console.log(item.date);

      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date,
      }

    })

    setTransactions(transactionsFormatted);

    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
    const lastTransactionExpenses = getLastTransactionDate(transactions, 'negative');
    const balanceInterval = `01 a ${lastTransactionExpenses}`;

    const balance = entriesTotal - expensesTotal;

    setHighlightData({
      entries: {
        total: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última entrada dia ${lastTransactionEntries}`,
      },
      expenses: {
        total: expensesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última saída dia ${lastTransactionExpenses}`,
      },
      balance: {
        total: balance.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: balanceInterval,
      },
    });
    // console.log(transactionsFormatted)
    setIsLoading(false);

  };

  useEffect(() => {
    loadTransactions();

    // const dataKey = '@gofinances:transactions';
    // AsyncStorage.removeItem(dataKey);
  },[]);

  useFocusEffect(useCallback(() => {
    loadTransactions();
  },[]));

  return (
    <Container>
      {
        isLoading ? 
        <LoadContainer>
          <ActivityIndicator 
            color={theme.colors.primary} 
            size="large"
          />
        </LoadContainer> : 
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={ {uri: 'https://avatars.githubusercontent.com/u/67206853?v=4'} } />
                <User>
                  <UserGreeting>Olá, </UserGreeting>
                  <UserName>Matheus </UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={() => {}}>
                <Icon name="power"/>
              </LogoutButton>
            </UserWrapper>

            
          </Header>

          <HighlightCards>
            <HighlightCard 
              type="up"
              title="Entradas"
              amount={highlightData.entries.total}
              lastTransaction={highlightData.entries.lastTransaction}
            />
            <HighlightCard 
              type="down"
              title="Saídas"
              amount={highlightData.expenses.total}
              lastTransaction={highlightData.expenses.lastTransaction}
            />
            <HighlightCard 
              type="total"
              title="Total"
              amount={highlightData.balance.total}
              lastTransaction={highlightData.balance.lastTransaction}
            />
          </HighlightCards>
        
          <Transactions>
            <Title>Listagem</Title>

            <TransactionList 
              data={transactions}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />

          </Transactions>
        </>
      }
    </Container>
  )
}

