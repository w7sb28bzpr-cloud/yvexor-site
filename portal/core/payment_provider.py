"""No browser callback or unsigned event is allowed to issue credits."""
from abc import ABC, abstractmethod


class PaymentProvider(ABC):
    @abstractmethod
    def create_payment(self, topup): ...

    @abstractmethod
    def verify_webhook(self, payload, signature): ...

    @abstractmethod
    def get_payment_status(self, reference): ...

    @abstractmethod
    def refund_payment(self, reference, amount_cents): ...


class UnavailableProvider(PaymentProvider):
    def create_payment(self, topup):
        raise NotImplementedError('La recharge bancaire sera disponible après connexion de Stripe.')

    def verify_webhook(self, payload, signature):
        raise NotImplementedError('Aucun fournisseur de paiement configuré.')

    def get_payment_status(self, reference):
        return 'UNAVAILABLE'

    def refund_payment(self, reference, amount_cents):
        raise NotImplementedError('Aucun paiement bancaire effectué ici.')


provider = UnavailableProvider()
